import {ImgLoader} from "../shared/components/atoms"

const Home = () => {
    return (
        <>
            <ImgLoader imgType={'logo'} imgSize={'full'}/>
            <a href="http://localhost:8888/oauth2/authorization/kakao">
                <ImgLoader imgType={'login'} imgSize={'full'}/>
            </a>
        </>
    )
}

export default Home