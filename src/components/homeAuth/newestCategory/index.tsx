import courseService from "@/src/services/courseService";
import useSWR from "swr";
import SlideComponent from "../../commom/slideComponent";
import styles from "../../../../styles/slideSection.module.scss"
import { Container } from "reactstrap";
import PageSpinner from "../../commom/spinner";

const NewestCategory = () => {
    const { data, error } = useSWR("/newest", courseService.getNewestCourse);

    if (error) return error;
    if (!data) {
        return <PageSpinner/>
    }
    return (
        <>
            <Container className='d-flex flex-column align-items-center pt-5'>
                <p className={styles.titleCategory}>LANÇAMENTOS</p>
                <SlideComponent course={data.data}/>
            </Container>
        </>
    )
}

export default NewestCategory