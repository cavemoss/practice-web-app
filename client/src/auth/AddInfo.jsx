import { useRef, useState, createContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import css from '../assets/styles/auth.module.css'
import placeholder from '../assets/icons/placeholder.webp'
import Model from "../components/Model.jsx"
import { centerCrop, makeAspectCrop } from "react-image-crop"
import axios from 'axios'

export const imgSrcContext = createContext()
const ASPECT_RATIO = 1
const MIN_DIMENSION = 120

export default function AddInfo(){

    const navigate = useNavigate()

    const nextButton = useRef()
    const profilePic = useRef()
    const updateProfilePic = (imgSrc) => profilePic.current = imgSrc

    const [profilePicError, setProfilePicError] = useState({inputFieldError: null, errorMessage: ''})
    const [bioError, setBioError] = useState({inputFieldError: null, errorMessage: ''})

    const [userInput, setUserInput] = useState({
        profilePic: null,
        bio: null
    })

    function onChangeBio(event) {setUserInput({...userInput, bio: event.target.value.trim()})}  

    useEffect(() => {
        if(!userInput.profilePic) updateProfilePic(placeholder)
        else setProfilePicError({inputFieldError: null, errorMessage: ''})
    }, [userInput.profilePic])

    useEffect(() => {
        nextButton.current.disabled = true
    }, [])

    useEffect(() => {

        if(userInput.bio) {
            nextButton.current.disabled = false
            if(userInput.bio.length > 255) {
                setBioError({inputFieldError: css.inputFieldError, errorMessage: 'No more then 255 characters'})
                nextButton.current.disabled = true
            } else {
                setBioError({inputFieldError: null, errorMessage: ''})
            }
        } else {
            setBioError({inputFieldError: null, errorMessage: ''})
        }

        if(userInput.profilePic) {
            nextButton.current.disabled = false
        } else {
            setProfilePicError({inputFieldError: null, errorMessage: ''})
        }

        if (!userInput.bio && !userInput.profilePic) nextButton.current.disabled = true

    }, [userInput])


    const [modelOpen, setModelOpen] = useState(false)
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState()

    function onSelectImage(event){
        setModelOpen(true)

        const file = event.target.files?.[0]
        if(!file) return

        const reader = new FileReader()

        reader.addEventListener('load', () => {
            const imageElement = new Image()
            const imageUrl = reader.result?.toString() || ''
            imageElement.src = imageUrl

            imageElement.addEventListener('load', (event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget
                if(naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setModelOpen(false)
                    setProfilePicError({inputFieldError: css.inputFieldError, errorMessage: `Image must be at least ${MIN_DIMENSION + 'x' + MIN_DIMENSION}px`})
                    nextButton.current.disabled = true
                    updateProfilePic(placeholder)
                }
            })

            setImgSrc(imageUrl)
        })

        reader.readAsDataURL(file)
    }

    function onImageLoad(event){
        const { width, height } = event.currentTarget
        const cropWidth = (MIN_DIMENSION / width) * 100
        const crop = makeAspectCrop({unit: '%', width: cropWidth}, ASPECT_RATIO, width, height)
        const centeredCrop = centerCrop(crop, width, height)
        setCrop(centeredCrop)
    }

    function onChangeReactCrop(pixelCrop, percentCrop) {
        setCrop(percentCrop)
    }

    const value = {
        setModelOpen: setModelOpen,
        ASPECT_RATIO: ASPECT_RATIO,
        MIN_DIMENSION: MIN_DIMENSION,
        imgSrc: imgSrc,
        crop: crop,
        onImageLoad: onImageLoad,
        onChangeReactCrop: onChangeReactCrop,
        updateProfilePic: updateProfilePic,
        userInput: userInput,
        setUserInput: setUserInput
    }

    async function submit() {

        let response = await axios.put('/backend/auth/sign-up/add-info', {
            profilePic: userInput.profilePic,
            bio: userInput.bio
        }); response = response.data

        if(response.message) {
            alert(response.httpStatus)
            navigate('/sign-up')
        }
        else navigate('/sign-up/confirm-email')
    }

    async function skip() {

        let response = await axios.put('/backend/auth/sign-up/add-info', {
            profilePic: placeholder,
            bio: null
        }); response = response.data

        if(response.message) {
            alert(response.httpStatus)
            navigate('/sign-up')
        }
        else navigate('/sign-up/confirm-email')
    }

    return(
        <>
            <div className={css.card}>
                <h1>Add Info</h1>

                <div id={profilePicError.inputFieldError}>
                    <div className={css.profilePic} id={css.profilePicError}> 
                        <div className={css.shadow}></div>
                        <img src={profilePic.current} />
                        <button onClick={() => document.querySelector('input[type="file"]').click()}>{(userInput.profilePic)?('edit'):('add')}</button>
                        <input id={css.fileInput} onChange={onSelectImage} type="file" accept="image/*" />
                    </div>
                    <div className={css.errorMessage} style={{position: 'absolute', marginTop: '120px'}}>{profilePicError.errorMessage}</div>
                </div>

                <div id={bioError.inputFieldError}>
                    <div className={css.inputField}>
                        <textarea onChange={onChangeBio} placeholder=" "></textarea>
                        <p>tell about yourself</p>
                    </div>
                    <div className={css.errorMessage} style={{marginTop: '-30px', marginBottom: '35px'}}>{bioError.errorMessage} </div>
                </div>

                <div className={css.skip} style={{marginTop: '-5px'}}>
                    <button className={css.skipButton} onClick={skip}>Skip</button>
                    <button ref={nextButton} onClick={submit}>Next</button>
                </div>

                <div className={css.hints}>
                    <p>Login <span className={css.link} onClick={() => navigate('/login')}>here</span></p>
                    <p>Proceed as a <span className={css.link} onClick={() => navigate('/posts')}>guest</span></p>
                </div>
            </div>
            
            <imgSrcContext.Provider value={value}>
                {(modelOpen) ? (<Model />) : (<></>)}
            </imgSrcContext.Provider>
        </>
    )
}