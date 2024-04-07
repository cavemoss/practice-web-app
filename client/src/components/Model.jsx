import { useRef, useContext } from "react"
import ReactCrop, { convertToPixelCrop } from "react-image-crop"
import css from '../assets/styles/auth.module.css'
import { imgSrcContext } from "../auth/AddInfo.jsx"

export default function Model(){

    const { 
        setModelOpen,
        ASPECT_RATIO, 
        MIN_DIMENSION,
        imgSrc, crop, 
        onImageLoad, 
        onChangeReactCrop, 
        updateProfilePic,
        userInput, setUserInput  
    } = useContext(imgSrcContext)

    const imgRef = useRef(null)
    const canvasRef = useRef(null)

    function setCanvasPreview(image, canvas, crop) {
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('No 2d context')

        const pixelRatio = window.devicePixelRatio
        const scaleY = image.naturalWidth / image.width
        const scaleX = image.naturalHeight / image.height

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'
        ctx.save()

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        ctx.translate(-cropX, -cropY)
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight
        )

        ctx.restore()
    }

    function onClick(){
        setCanvasPreview(
            imgRef.current, 
            canvasRef.current, 
            convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
        )
        updateProfilePic(canvasRef.current.toDataURL())
        setUserInput({...userInput, profilePic: canvasRef.current.toDataURL()})
        setModelOpen(false)
    }

    return(
        <div className={css.modelContainer}>
            <div className={css.model}>
                {imgSrc && 
                    <div>
                        <ReactCrop 
                            crop={crop} 
                            onChange={onChangeReactCrop}
                            circularCrop 
                            keepSelection 
                            aspect={ASPECT_RATIO} 
                            minWidth={MIN_DIMENSION}
                        >
                            <img ref={imgRef} src={imgSrc} style={{maxHeight: '70vh'}} onLoad={onImageLoad}/>
                        </ReactCrop> 
                        <button onClick={onClick}>Done</button>
                    </div>
                }
                {crop && <canvas ref={canvasRef}></canvas>}
            </div>
        </div>
    )
}