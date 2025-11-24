import type {ImgHTMLAttributes} from "react"

import ErrorImg from '@assets/images/error.png'
import LoginImg from '@assets/images/kakao_login_large_wide.png'
import LoadingImg from '@assets/images/loading.png'
import LogoImg from '@assets/images/logo.png'

export type ImgType = 'error' | 'login' | 'loading' | 'logo' | 'unknown'

interface ImgLoaderProps extends ImgHTMLAttributes<HTMLImageElement>{
    imgSize?: 'small' | 'medium' | 'large' | 'full'
    imgType: ImgType
    shape?: 'circle' | 'square'
    unknownSrc?: string
    unknownAlt?: string
}

export function ImgLoader({
    imgSize = 'small',
    imgType,
    shape = 'circle',
    unknownSrc = '',
    unknownAlt = '',
    ...rest
                                  }: ImgLoaderProps) {

    // TODO: px to rem
    const imgSizeStyle = {
        small: 'w-[24px] h-[24px]',
        medium: 'w-[48px] h-[48px]',
        large: 'w-[96px] h-[96px]',
        full: 'w-full'
    }

    const imgTypeSrc = {
        error: ErrorImg,
        login: LoginImg,
        loading: LoadingImg,
        logo: LogoImg,
        unknown: unknownSrc,
    }

    const imgTypeAlt = {
        error: 'Error Image',
        login: 'Login Image',
        loading: 'Loading Image',
        logo: 'Logo Image',
        unknown: unknownAlt,
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
