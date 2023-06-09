import { useRouter } from "next/router";
import styles from "../../../styles/episodePlayer.module.scss";
import Head from "next/head";
import HeaderGeneric from "@/src/components/commom/headerGeneric";
import { useEffect, useRef, useState } from "react";
import courseService, { CourseType } from "@/src/services/courseService";
import PageSpinner from "@/src/components/commom/spinner";
import { Button, Container } from "reactstrap";
import ReactPlayer from "react-player";
import watchEpisodeService from "@/src/services/episodeService";

const EpisodePlayer = function () {
  const router = useRouter()
  const episodeOrder = parseFloat(router.query.id?.toString() || "")
  const episodeId = parseFloat(router.query.episodeid?.toString() || "")

  const [course, setCourse] = useState<CourseType>()
  const [isReady, setIsReady] = useState(false)
  const [getEpisodeTime, setGetEpisodeTime] = useState(0)
  const [episodeTime, setEpisodeTime] = useState(0)
  const [loading, setLoading] = useState(true)

  const courseId = router.query.courseid?.toString() || ""

  const playerRef = useRef<ReactPlayer>(null)

  const handleGetEpisodeTime = async () => {
    const res = await watchEpisodeService.getWatchTime(episodeId)
    if (res.data != null) {
      setGetEpisodeTime(res.data.seconds)
    }
  }

  const handleSetEpisodeTime = async () => {
    await watchEpisodeService.setWatchTime({
      episodeId: episodeId,
      seconds: Math.round(episodeTime)
    })
  }

  useEffect(()=>{
    handleGetEpisodeTime()
  }, [router])

  const handlePlayerTime = () => {
    playerRef.current?.seekTo(getEpisodeTime)
    setIsReady(true)
  }

  if (isReady === true) {
    setTimeout( () => {
      handleSetEpisodeTime()
    }, 1000 * 3)
  }

  const getCourse =async function () {
    if (typeof courseId !== "string") return 

    const res = await courseService.getEpisodes(courseId)

    if(res.status === 200){
      setCourse(res.data)
    }
  }

  
  const handleLastEpisode = () => {
    router.push(`/courses/episode/${episodeOrder - 1}?courseid=${course?.id}&episodeid=${episodeId - 1}`)
  }
  

  const handleNextEpisode = () => {
    router.push(`/courses/episode/${episodeOrder + 1}?courseid=${course?.id}&episodeid=${episodeId + 1}`)
  }

  
  useEffect(() => {
    getCourse()
  }, [courseId])

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
  
  if (course?.episodes === undefined) return <PageSpinner />

  if (episodeOrder + 1 < course?.episodes?.length){
    if (Math.round(episodeTime) === course.episodes[episodeOrder].secondsLong){
      handleNextEpisode()
    }
  }
  

  return (
    <>
      <Head>
        <title>DevFlix - {course.episodes[episodeOrder].name}</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
      </Head>
      <main>
        <HeaderGeneric logoUrl="/home" btnContent={'Voltar para o curso'} btnUrl={`/courses/${courseId}`}/>
        <Container className="d-flex flex-column align-items-center gap-3 pt-5">
          <p className={styles.episodeTitle}> {course.episodes[episodeOrder].name}</p>
          {typeof window === 'undefined' ? null : (
            <div className={styles.videoWrapper}>
              <ReactPlayer 
                className= {styles.player} 
                url={`${process.env.NEXT_PUBLIC_BASEURL}/episodes/stream?videoUrl=${course.episodes[episodeOrder].videoUrl}&token=${sessionStorage.getItem("devflix-token")}`} 
                controls 
                ref={playerRef} 
                onStart={handlePlayerTime}
                onProgress={(progress) => {
                  setEpisodeTime(progress.playedSeconds)
                }}/>
            </div>
          )}
          <div className={styles.episodeButtonDiv} >
            <Button disabled={episodeOrder === 0 ? true : false} onClick={handleLastEpisode} className={styles.episodeButton}><img src="/episode/iconArrowLeft.svg" alt="setaEsquerda" className={styles.arrowImg}/></Button>
            <Button disabled={episodeOrder + 1 === course.episodes.length ? true : false} onClick={handleNextEpisode} className={styles.episodeButton}><img src="/episode/iconArrowRight.svg" alt="setaDireita" className={styles.arrowImg}/></Button>
          </div>
        </Container>
      </main>
    </>
  );
};

export default EpisodePlayer;