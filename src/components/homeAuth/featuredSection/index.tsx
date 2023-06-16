import Link from "next/link";
import { Button, Container } from "reactstrap";
import useSWR from "swr";
import courseService, { CourseType } from "../../../services/courseService";
import HeaderAuth from "../../commom/headerAuth";
import PageSpinner from "../../commom/spinner";
import styles from "./styles.module.scss"

const FeaturedSection= function () {
    const { data, error } = useSWR("/featured", courseService.getFeaturedCourses);

    if (error) return error;
    if (!data) {
        return <PageSpinner/>
    }

    return (
        <>
            {
        data.data?.map((course: CourseType)=>(
            <div key={course.id} style={{
                backgroundImage: `linear-gradient(to bottom, #6666661a, #151515), 
                url(${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl})`,
                backgroundSize: "cover", 
                backgroundPosition: "center",
                }} className={styles.divImage}>
                <HeaderAuth/>
                <Container className="pt-5">
                    <p className={styles.title}>{course.name}</p>
                    <p className={styles.description}>{course.synopsis}</p>
                    <Link href={`/courses/${course.id}`} className={styles.a}>
                        <Button outline color="light" className={styles.button}>
                            ACESSE AGORA
                            <img src="/buttonPlay.svg" alt="buttonImg" className={styles.buttonImg}/>
                        </Button>
                    </Link>
                </Container>
            </div>
        ))[0]
            }
        </>
    )
}

export default FeaturedSection