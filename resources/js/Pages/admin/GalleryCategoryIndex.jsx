import CategoryManager from '../../Components/CategoryManager';

export default function GalleryCategoryIndex(props) {
    return (
        <CategoryManager
            {...props}
            singular="Kategori Galeri"
            endpoint="/admin/kategori-galeri"
        />
    );
}
