import CategoryManager from '../../Components/CategoryManager';

export default function AssetCategoryIndex(props) {
    return (
        <CategoryManager
            {...props}
            singular="Kategori Aset"
            endpoint="/admin/kategori-aset"
            codeField
        />
    );
}
