import type {ImgHTMLAttributes} from "react"

import ErrorImg from '../../../assets/error.png'
import LoginImg from '../../../assets/kakao_login_large_wide.png'
import LoadingImg from '../../../assets/loading.png'
import LogoImg from '../../../assets/logo.png'

export type ImgType = 'error' | 'login' | 'loading' | 'logo'

interface ImgLoaderProps extends ImgHTMLAttributes<HTMLImageElement>{
    imgSize?: 'small' | 'medium' | 'large' | 'full'
    imgType: ImgType
    shape?: 'circle' | 'square'
}

export default function ImgLoader({
    imgSize = 'small',
    imgType,
    shape = 'circle',
    ...rest
                                  }: ImgLoaderProps) {

    const imgSizeStyle = {
        small: 'w-[24px]',
        medium: 'w-[48px]',
        large: 'w-[96px]',
        full: 'w-full'
    }

    const imgTypeSrc = {
        error: ErrorImg,
        login: LoginImg,
        loading: LoadingImg,
        logo: LogoImg,
    }

    const imgTypeAlt = {
        error: 'Error Image',
        login: 'Login Image',
        loading: 'Loading Image',
        logo: 'Logo Image',
    }

    const shapeStyle = {
        circle: 'rounded-sm',
        square: 'rounded-md',
    }
    
    const styles = `${imgSizeStyle[imgSize]} ${shapeStyle[shape]}`

    return (
        <img
            className={styles}
            src={imgTypeSrc[imgType]}
            alt={imgTypeAlt[imgType]}
            {...rest} />
    )
}
