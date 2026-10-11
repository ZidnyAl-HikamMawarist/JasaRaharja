import CategoryManager from '../../Components/CategoryManager';

export default function ArticleCategoryIndex(props) {
    return (
        <CategoryManager
            {...props}
            singular="Kategori"
            endpoint="/admin/kategori-berita"
            colorField
        />
    );
}
