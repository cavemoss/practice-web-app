import css from '../assets/styles/new.module.css'

export default function ImagesFlex(props) {

    function navigate(imgSrc) {
        if(!props.inline) window.location.replace(imgSrc)
    }

    return(
        <>
            <div className={css.imageFlex}>
                {props.images.map(imgSrc => <img key={props.images.indexOf(imgSrc)} src={imgSrc} onClick={() => navigate(imgSrc)} />)}
            </div>
        </>
    )
}