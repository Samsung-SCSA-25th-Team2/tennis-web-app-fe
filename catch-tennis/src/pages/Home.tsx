import KakaoLoginImg from "../assets/kakao_login_large_wide.png"
import LogoImg from "../assets/logo.png"

const Home = () => {
    return (
        <>
            <img src={LogoImg} alt="logo"/>
            <a href="http://localhost:8888/oauth2/authorization/kakao">
                <img src={KakaoLoginImg} alt="kakao login" />
            </a>
        </>
    )
}

export default Home