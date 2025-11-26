import {type ImgHTMLAttributes, useState} from "react"

import Error404Img from '@assets/images/404_error.png'
import Error500Img from '@assets/images/500_error.png'
import LoginImg from '@assets/images/kakao_login_large_wide.png'
import LoadingImg from '@assets/images/loading.png'
import LogoImg from '@assets/images/logo.png'

export type ImgType = '404_error' | '500_error' | 'login' | 'loading' | 'logo' | 'unknown'

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

    const [isError, setIsError] = useState(false)

    // TODO: px to rem
    const imgSizeStyle = {
        small: 'w-[24px] h-[24px]',
        medium: 'w-[48px] h-[48px]',
        large: 'w-[96px] h-[96px]',
        full: 'w-full'
    }

    const imgTypeSrc = {
        '404_error': Error404Img,
        '500_error': Error500Img,
        login: LoginImg,
        loading: LoadingImg,
        logo: LogoImg,
        unknown: unknownSrc,
    }

    const imgTypeAlt = {
        '404_error': '404 Error Image',
        '500_error': '500 Error Image',
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

    const handleError = () => {
        if (!isError) {
            setIsError(true)
        }
    }

    return (
        <>
            {
                isError
                    ? <img
                        className={styles}
                        src={imgTypeSrc['404_error']}
                        alt={imgTypeAlt['404_error']}
                        onError={handleError}
                        {...rest} />
                    : <img
                        className={styles}
                        src={imgTypeSrc[imgType]}
                        alt={imgTypeAlt[imgType]}
                        onError={handleError}
                        {...rest} />
            }
        </>
    )
}
