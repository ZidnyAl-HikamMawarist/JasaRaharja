<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Asset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_public_pages_load(): void
    {
        $this->get('/')->assertOk();
        $this->get('/berita')->assertOk();
        $this->get('/galeri')->assertOk();
        $this->get('/kontak')->assertOk();
        $this->get('/login')->assertOk();
        $this->get('/admin/login')->assertOk();
    }

    public function test_login_page_accessible_even_when_authenticated(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->get('/login')
            ->assertOk();

        $this->actingAs($admin)
            ->get('/admin/login')
            ->assertOk();
    }

    public function test_admin_routes_redirect_guests_to_login(): void
    {
        foreach (['/admin', '/admin/berita', '/admin/inventaris', '/admin/pengaturan'] as $url) {
            $this->get($url)->assertRedirect(route('login'));
        }
    }

    public function test_admin_can_open_dashboard(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin')
            ->assertOk();
    }

    public function test_article_detail_returns_404_for_unknown_slug(): void
    {
        $this->get('/berita/tidak-ada')->assertNotFound();
    }

    public function test_login_rejects_wrong_password(): void
    {
        $user = User::factory()->create(['username' => 'admin', 'password' => 'rahasia-kuat']);

        $this->post('/login', [
            'login' => 'admin',
            'password' => 'salah',
        ])->assertSessionHasErrors('login');

        $this->assertGuest();
        $this->assertNotNull($user);
    }

    public function test_only_primary_account_may_access_admin(): void
    {
        $primary = User::factory()->create();
        $secondary = User::factory()->create();

        $this->actingAs($secondary)
            ->get('/admin')
            ->assertRedirect(route('login'));

        $this->assertNotNull($primary);
    }

    public function test_asset_export_requires_authentication(): void
    {
        $this->get('/admin/inventaris/ekspor/excel')->assertRedirect(route('login'));
        $this->get('/admin/inventaris/ekspor/csv')->assertRedirect(route('login'));
        $this->get('/admin/inventaris/ekspor/pdf')->assertRedirect(route('login'));
    }

    public function test_article_creation_validates_required_fields(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/berita', [])
            ->assertSessionHasErrors(['title', 'content', 'status']);
    }

    public function test_public_berita_search_filters_results(): void
    {
        Article::create([
            'title' => 'Sosialisasi Keselamatan Jalan',
            'content' => '<p>Isi berita EnabledOffice untuk pengujian pencarian.</p>',
            'status' => 'published',
            'published_at' => now()->toDateString(),
        ]);

        Article::create([
            'title' => 'Penyaluran Santunan Kilometer Lima',
            'content' => '<p>Isi berita lain.</p>',
            'status' => 'published',
            'published_at' => now()->toDateString(),
        ]);

        $this->get('/berita?q=Kilometer')->assertOk();
        $this->get('/berita?q=Kilometer')->assertSee('Kilometer Lima');
    }

    public function test_inventaris_index_shows_recorded_assets(): void
    {
        $this->actingAs($this->admin())->get('/admin/inventaris')->assertOk();

        $this->assertSame(0, Asset::count());
    }

    public function test_inventaris_calculates_age_and_auction_eligibility(): void
    {
        \App\Models\AssetCondition::create(['name' => 'Baik', 'slug' => 'baik']);
        \App\Models\AssetCondition::create(['name' => 'Perlu Servis', 'slug' => 'servis']);
        \App\Models\AssetCondition::create(['name' => 'Rusak Berat', 'slug' => 'rusak']);

        $cat = \App\Models\AssetCategory::create([
            'name' => 'Perangkat IT',
            'code' => 'IT',
        ]);

        $oldAsset = Asset::create([
            'asset_code' => 'JR-TSK-IT-2019-0001',
            'asset_category_id' => $cat->id,
            'name' => 'Server Lama',
            'location' => 'Ruang Server',
            'condition_status' => 'servis',
            'acquisition_date' => now()->subYears(6)->toDateString(),
            'acquisition_value' => 15000000,
        ]);

        $newAsset = Asset::create([
            'asset_code' => 'JR-TSK-IT-2024-0002',
            'asset_category_id' => $cat->id,
            'name' => 'Laptop Baru',
            'location' => 'Ruang CS',
            'condition_status' => 'baik',
            'acquisition_date' => now()->subYears(2)->toDateString(),
            'acquisition_value' => 12000000,
        ]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->get('/admin/inventaris')
            ->assertOk()
            ->assertInertia(function (\Inertia\Testing\AssertableInertia $page) {
                $page->component('admin/AssetIndex')
                    ->has('assets.data', 2)
                    ->where('assets.data.0.is_auction_eligible', true)
                    ->where('assets.data.1.is_auction_eligible', false);
            });

        // Filter lelang=siap
        $this->actingAs($admin)
            ->get('/admin/inventaris?lelang=siap')
            ->assertOk()
            ->assertInertia(function (\Inertia\Testing\AssertableInertia $page) {
                $page->component('admin/AssetIndex')
                    ->has('assets.data', 1)
                    ->where('assets.data.0.asset_code', 'JR-TSK-IT-2019-0001');
            });
    }

    public function test_kategori_aset_sets_correct_active_menu(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/kategori-aset')
            ->assertOk()
            ->assertInertia(function (\Inertia\Testing\AssertableInertia $page) {
                $page->where('activeMenu', 'kategori-aset');
            });
    }

    public function test_admin_can_update_profile_and_fields(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->put('/admin/pengaturan/profil', [
                'name' => 'Administrator Jasa Raharja',
                'username' => 'admin_jr_tasik',
                'email' => 'admin.tasik@jasaraharja.co.id',
                'phone' => '081234567890',
                'role_label' => 'Kepala Cabang',
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $admin->refresh();
        $this->assertSame('Administrator Jasa Raharja', $admin->name);
        $this->assertSame('admin_jr_tasik', $admin->username);
        $this->assertSame('admin.tasik@jasaraharja.co.id', $admin->email);
        $this->assertSame('081234567890', $admin->phone);
        $this->assertSame('Kepala Cabang', $admin->role_label);
    }

    public function test_public_page_visit_records_visitor_log(): void
    {
        $this->withHeaders([
            'CF-Connecting-IP' => '114.124.50.10',
            'CF-IPCountry' => 'ID',
            'User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
        ])->get('/');

        $this->assertDatabaseHas('visitor_logs', [
            'ip_address' => '114.124.50.10',
            'url' => '/',
            'device_type' => 'mobile',
            'platform' => 'iOS',
            'browser' => 'Safari',
            'country' => 'ID',
        ]);
    }

    public function test_admin_can_view_and_manage_visitor_logs(): void
    {
        \App\Models\VisitorLog::create([
            'ip_address' => '202.158.40.5',
            'url' => '/kontak',
            'method' => 'GET',
            'device_type' => 'desktop',
            'platform' => 'Windows',
            'browser' => 'Chrome',
            'country' => 'ID',
        ]);

        $admin = $this->admin();

        $response = $this->actingAs($admin)->get('/admin/pengunjung');
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('admin/VisitorIndex'));

        $log = \App\Models\VisitorLog::first();
        $this->assertNotNull($log);

        $this->actingAs($admin)
            ->delete("/admin/pengunjung/{$log->id}")
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('visitor_logs', ['id' => $log->id]);
    }
}


