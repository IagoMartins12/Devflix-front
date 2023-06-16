import { Container } from 'reactstrap'
import styles from './styles.module.scss'
import { GrLinkedin } from 'react-icons/gr'
import { BsGithub,BsInstagram} from 'react-icons/bs'

const Footer = () => {
    return (
        <>
        <Container className={styles.footer}>
            <img src="/logoOnebitcode.svg" alt="logoFooter" className={styles.footerLogo}/>
            <div className='d-flex gap-3'>
                <a href="https://www.linkedin.com/in/iago-martins-313838213/" className={styles.footerIcon} target="_blank"> <GrLinkedin size={23}/></a>
                <a href="https://github.com/IagoMartins12" className={styles.footerIcon} target="_blank"> <BsGithub size={23}/></a>
                <a href="https://www.instagram.com/iago_martins1/" className={styles.footerIcon} target="_blank"> <BsInstagram size={23}/></a>
            </div>
        </Container>
        <Container fluid className='d-flex justify-content-center align-items-center'>
            <span className= {styles.footerName}> Iago Martins &copy;2022 </span>
        </Container>

        </>
    )
}

export default Footer