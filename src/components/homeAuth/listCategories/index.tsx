import categoriesService, { CategoryTipe } from "@/src/services/categoriesService";
import { Container } from "reactstrap";
import useSWR from "swr";
import PageSpinner from "../../commom/spinner";
import ListCategoriesSlide from "../listCategoriesSlide";

const ListCategories = ( ) => {
    const { data, error } = useSWR("/listCategories", categoriesService.getCategories);

    if (error) return error;
    if (!data) {
        return <PageSpinner/>
    }
    return (
        <>{data.data.categories?.map(( categorie: CategoryTipe ) => (
            <ListCategoriesSlide key={categorie.id} categoryId={categorie.id} categoryName={categorie.name}/>
        ))}
        </>
    )
}

export default ListCategories