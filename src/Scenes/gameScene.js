import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, setExtraVolume, setPrimaryAudio, setRepeatAudio, setRepeatType, startRepeatAudio, stopRepeatAudio } from "../components/CommonFunctions"
import { prePathUrl } from "../components/CommonFunctions";
import { OptionScene } from "./optionScene"

let timerList = []
let stepCount = 0;


let audioPathList = [
    ['27', '28'],
    ['29', '30'],
    ['31', '32'],
]

const Scene = React.forwardRef(({ nextFunc, _baseGeo, _geo, loadFunc }, ref) => {


    const audioList = useContext(UserContext)

    const firstPartRef = useRef()
    const secondPartRef = useRef();

    const blackWhiteObject = useRef();
    const firstImgRef = useRef();
    const buttonRefs = useRef()
    const starRefs = Array.from({ length: 7 }, ref => useRef())

    const aniImageList = Array.from({ length: 4 }, ref => useRef())
    const [isSecondShow, setSecondShow] = useState(false)

    const optionRef = useRef()

    const [isSceneLoad, setSceneLoad] = useState(false)
    const parentRef = useRef()

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {


            setExtraVolume(audioList.commonAudio2, 6)
            setExtraVolume(audioList.commonAudio1, 6)
            setExtraVolume(audioList.successAudio, 2)

            setExtraVolume(audioList.bodyAudio2, 8)

            setExtraVolume(audioList.buzzAudio, 2.5)
            setExtraVolume(audioList.tingAudio, 2.5)

            setExtraVolume(audioList.yeahAudio, 2)
            setExtraVolume(audioList.clapAudio, 2)

            parentRef.current.className = 'aniObject'


            startFirstPart()
            loadFunc()
        },
        sceneEnd: () => {
            setSceneLoad(false)
            stepCount = 0;

            stopRepeatAudio()

        }

    }))

    useEffect(() => {

        setRepeatType(1)

        return () => {
            stepCount = 0;
            stopRepeatAudio()
        }
    }, [])

    const startFirstPart = () => {
        optionRef.current.startGame()
    }

    const playZoomAnimation = () => {
        let imageNum = 0;
        blackWhiteObject.current.className = 'hideMask'
        firstImgRef.current.setClass('hideObject')

        aniImageList[0].current.setClass('showObject')
        let imageShowInterval = setInterval(() => {
            aniImageList[imageNum].current.setClass('hideObject')
            imageNum++
            aniImageList[imageNum].current.setClass('showobject')
            if (imageNum == 3) {
                clearInterval(imageShowInterval)
                showControlFunc()
            }
        }, 150);
    }

    const showControlFunc = () => {

        if (stepCount < 2) {
            blackWhiteObject.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/questions/q' + (stepCount + 2) + '/mask.png")'
            aniImageList.map((image, index) => {
                if (index < 3)
                    image.current.setUrl('questions/q' + (stepCount + 2) + '/q' + (index + 1) + '.png')
            })
        }

        timerList[2] = setTimeout(() => {
            audioList.commonAudio2.play();
            startRepeatAudio()
        }, 500);

        buttonRefs.current.className = 'show'
    }

    const returnBackground = () => {
        firstImgRef.current.setClass('show')
        buttonRefs.current.className = 'hideObject'
        aniImageList[3].current.setClass('hideObject')
        blackWhiteObject.current.className = 'show halfOpacity'

        aniImageList[3].current.setUrl('questions/q' + (stepCount + 1) + '/q4.png')

        timerList[3] = setTimeout(() => {
            audioList.bodyAudio1.play().catch(error => { });

            setTimeout(() => {
                playZoomAnimation();

            }, audioList.bodyAudio1.duration * 1000 + 2000);
        }, 2500);
    }

    const clickAnswer = () => {
        //play answer..
        clearTimeout(timerList[3])
        clearTimeout(timerList[2])

        stopRepeatAudio()

        audioList.commonAudio2.pause();


        stepCount++
        if (stepCount < audioPathList.length)
            audioList.bodyAudio1.src = getAudioPath('question/q' + (stepCount + 1), audioPathList[stepCount][0])  //question

        audioList.bodyAudio2.play().catch(error => { });
        buttonRefs.current.style.pointerEvents = 'none'

        setTimeout(() => {
            audioList.successAudio.play().catch(error => { })
            starRefs[stepCount + 3].current.setClass('show')

            if (stepCount < audioPathList.length)
                audioList.bodyAudio2.src = getAudioPath('question/q' + (stepCount + 1), audioPathList[stepCount][1])  //question


            setTimeout(() => {
                audioList.successAudio.pause();
                audioList.successAudio.currentTime = 0;

                if (stepCount < 3) {
                    returnBackground();
                    buttonRefs.current.style.pointerEvents = ''
                }
                else {
                    setTimeout(() => {
                        nextFunc()
                    }, 2000);
                }
            }, 4000);

        }, audioList.bodyAudio2.duration * 1000);
    }

    //2022-3-27 modified by Cheng...

    const clickedFunc = (num) => {
        if (num == 1) //right option
        {
            audioList.tingAudio.play().catch(error => { })
            starRefs[stepCount].current.setClass('show')
            stepCount++

            // nextFunc()
        }

        setSecondShow(true)
    }

    const startSecondPart = () => {

        firstPartRef.current.className = 'disapear'

        stepCount = 0

        setPrimaryAudio(audioList.bodyAudio1)
        setRepeatAudio(audioList.commonAudio2)

        setTimeout(() => {
            secondPartRef.current.className = 'aniObject'
            blackWhiteObject.current.className = 'show halfOpacity'

            aniImageList.map(image => {
                image.current.setClass('hideObject')
            })

            buttonRefs.current.className = 'hideObject'

            setTimeout(() => {

                audioList.bodyAudio1.play().catch(error => { });

                setTimeout(() => {
                    playZoomAnimation();
                }, audioList.bodyAudio1.duration * 1000 + 2000);
            }, 3000);

        }, 500);

        audioList.bodyAudio1.src = getAudioPath('question/q' + (stepCount + 1), audioPathList[stepCount][0])  //question
        audioList.bodyAudio2.src = getAudioPath('question/q' + (stepCount + 1), audioPathList[stepCount][1])  //answer
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div
                    ref={parentRef}
                    className='hideObject'>
                    <div className='aniObject'>
                        <div
                            style={{
                                position: "fixed", width: _baseGeo.width + "px"
                                , height: _baseGeo.height + "px",
                                left: _baseGeo.left + 'px',
                                top: _baseGeo.top + 'px',
                                pointerEvents: 'none'
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute", width: '100%'
                                    , height: '100%',
                                    left: '0%',
                                    top: '0%'
                                }} >
                                <img
                                    width={'100%'}
                                    style={{
                                        position: 'absolute',
                                        left: '0%',
                                        top: '0%',

                                    }}
                                    src={prePathUrl() + "images/bg/green_bg.png"}
                                />
                            </div>

                            {
                                Array.from(Array(7).keys()).map(value =>
                                    <div
                                        style={{
                                            position: "fixed", width: _geo.width * 0.05 + "px",
                                            right: _geo.width * (value * 0.042 + 0.01) + 'px'
                                            , top: 0.02 * _geo.height + 'px'
                                            , cursor: "pointer",
                                        }}>
                                        <BaseImage
                                            url={'icon/sb13_progress_bar_gray.png'}
                                        />
                                        <BaseImage
                                            ref={starRefs[6 - value]}
                                            url={'icon/sb13_progress_bar.png'}
                                            className='hideObject'
                                        />
                                    </div>)
                            }
                        </div>

                        {
                            isSecondShow
                            &&
                            <div
                                ref={secondPartRef}
                                className='hideObject'
                                style={{
                                    position: "fixed", width: _baseGeo.width + "px"
                                    , height: _baseGeo.height + "px",
                                    left: _baseGeo.left + 'px',
                                    top: _baseGeo.top + 'px',
                                }}
                            >


                                <BaseImage
                                    ref={firstImgRef}
                                    url={"questions/q1/q0.png"}
                                />

                                <div
                                    ref={blackWhiteObject}
                                    className="halfOpacity"
                                    style={{
                                        position: "absolute", width: '100%'
                                        , height: '100%',
                                        left: '0%',
                                        top: '0%',
                                        WebkitMaskImage: 'url(' + prePathUrl() + 'images/questions/q1/mask.png)',
                                        WebkitMaskSize: '100% 100%',
                                        WebkitMaskRepeat: "no-repeat",
                                        background: 'black',

                                    }} >

                                </div>

                                {
                                    [1, 2, 3].map(value =>
                                        <BaseImage
                                            ref={aniImageList[value - 1]}
                                            scale={1}
                                            posInfo={{ l: 0, t: 0 }}
                                            url={"questions/q1/q" + value + ".png"}
                                        />
                                    )
                                }

                                <div
                                    style={{
                                        position: "fixed", width: _geo.width * 1.3 + "px",
                                        height: _geo.height + "px",
                                        left: _geo.left - _geo.width * 0.15 + 'px'
                                        , top: _geo.top - _geo.height * 0.19 + 'px'
                                    }}>
                                    <BaseImage
                                        ref={aniImageList[3]}
                                        url={"questions/q1/q4.png"}
                                    />
                                </div>


                                <div ref={buttonRefs}>
                                    <div
                                        className='commonButton'
                                        onClick={clickAnswer}
                                        style={{
                                            position: "fixed", width: _geo.width * 0.1 + "px",
                                            height: _geo.width * 0.1 + "px",
                                            left: _geo.left + _geo.width * 0.445
                                            , top: _geo.top + _geo.height * 0.72
                                            , cursor: "pointer",
                                            borderRadius: '50%',
                                            overflow: 'hidden',

                                        }}>
                                        <img

                                            width={"370%"}
                                            style={{
                                                position: 'absolute',
                                                left: '-230%',
                                                top: '-32%'
                                            }}
                                            draggable={false}
                                            src={prePathUrl() + 'images/buttons/answer_button.svg'}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        <div
                            ref={firstPartRef}
                        >
                            <OptionScene
                                ref={optionRef}
                                clickedFunc={clickedFunc}
                                nextFunc={startSecondPart}
                                _baseGeo={_baseGeo}
                                _geo={_geo} />

                        </div>

                    </div >
                </div>
            }
        </div>
    );
});

export default Scene;
