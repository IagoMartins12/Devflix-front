import styles from "../styles/search.module.scss";
import Head from "next/head";
import HeaderAuth from "@/src/components/commom/headerAuth";
import { useRouter } from "next/router";
import courseService, { CourseType } from "@/src/services/courseService";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SearchCard from "@/src/components/searchCard";
import Footer from "@/src/components/commom/footer";
import PageSpinner from "@/src/components/commom/spinner";

const Search = () => {

    const router = useRouter()
    const searchName : any = router.query.name
    const [searchResult, setSearchResult] = useState<CourseType[]>([])
    const [loading, setLoading] = useState(true)
    
    const searchCourses = async function () {
        const res = await courseService.getSearch(searchName)
        setSearchResult(res.data.courses)
    }

    useEffect(() => {
        searchCourses()
    }, [searchName])

    useEffect(() => {
        if (!sessionStorage.getItem('devflix-token')){
            router.push("/login")
        } else {
            setLoading(false)
        }
    }, [])

    if (loading){
        return <PageSpinner/>
    }
    
    if (searchResult === undefined) return <PageSpinner/>

    return (
        <>
        <Head>
            <title>DevFlix - {searchName}</title>
            <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
        </Head>
        <main className={styles.main}>
            <div className={styles.headFooterBg}>
                <HeaderAuth />
            </div>
            {searchResult.length >= 1 ? (
                <div className={styles.searchResult}>
                    <Container className="d-flex flex-wrap justify-content-center gap-5 py-4">
                    {searchResult?.map((course) => (
                        <SearchCard key={course.id} course={course}/>
                    ))}
                    </Container>
                </div>
            ) : (
                <div className={styles.searchResult}>
                    <p className={styles.noSearchResult}> Nenhum resultado encontrado :( </p>
                </div>
            ) }
            <div className={styles.headFooterBg}>
                <Footer />
            </div>
        </main>
        </>
    );
};

export default Search;