import React, { useState, useRef, useContext } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl } from "../components/CommonFunctions";

let currentMaskNum = 0;
const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, _startTransition, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()

    const maskPathList = [
        ['02', '03', '04'],
        ['00'],
        ['05'],
        ['06', '07'],
        ['06'],
        ['13', '15', '14'],
        ['09', '10'],
        ['11'],
        ['12'],
    ]

    // const outLineRefList = [useRef(), useRef(), useRef()]


    const maskTransformList = [
        { x: -0.06, y: 0.1, s: 1.2 },
        { x: 0.00, y: 0.0, s: 1 },
        { x: 0.15, y: -0.0, s: 1.8 },
        { x: 0.1, y: -0.1, s: 1.2 },

        { x: -0.1, y: 0.1, s: 1.4 },

        { x: 0.6, y: 0.2, s: 2.5 },
        { x: 0.3, y: 0.4, s: 2.5 },
        { x: -0.2, y: 0.3, s: 1.6 }, // 9
        { x: -0.5, y: 0.6, s: 2.5 }, // 9
    ]

    // const outLinePosList = [ // p-path
    //     ['02a', '03a', '04a'],
    //     ['05a'],
    //     [],
    //     [],
    //     ['08a', '08b', '08c'],
    //     ['09a', '10a'],
    //     [],
    //     ['12a'],
    // ]

    const marginPosList = [
        {},
        {},
        { s: 1, l: 0.4, t: 0.4 },
        {},
        { s: 1, l: 0.6, t: 0.4 },

        {}, //vagetable
        {},
        { s: 1, l: 0.7, t: 0.2 }, // 9
        {},
    ]

    const audioPathList = [
        ['02'],
        ['03'],
        ['04'],
        ['05'],
        ['06'],
        ['07'],
        ['08'],
        ['09'],
        ['10', '11'],
    ]

    const [isSceneLoad, setSceneLoad] = useState(false)


    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            baseObject.current.className = 'aniObject'
            audioList.bodyAudio1.src = prePathUrl() + getAudioPath('intro', '02');
            audioList.bodyAudio2.src = prePathUrl() + getAudioPath('intro', '01');
            audioList.bodyAudio3.src = prePathUrl() + getAudioPath('intro', '03');

            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[currentMaskNum][0], true) + '")'



            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            setTimeout(() => {
                audioList.bodyAudio2.play()
                loadFunc()
                setTimeout(() => {
                    showIndividualImage()
                }, audioList.bodyAudio2.duration * 1000 + 1000);
            }, 3000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/SB11_intro_' + imgName + '.png')
            : ('intro/SB11_intro_' + imgName + '.png');
    }

    const durationList = [
        2, 1.4, 1.4, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1
    ]
    function showIndividualImage() {

        baseObject.current.style.transition = durationList[currentMaskNum] + 's'


        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = audioList.bodyAudio1.duration * 1000 + 500
            let isSubAudio = false

            if (audioPathList[currentMaskNum].length > 1) {
                timeDuration += (audioList.bodyAudio3.duration * 1000 - 1000)
                isSubAudio = true;
            }

            blackWhiteObject.current.className = 'show'
            colorObject.current.className = 'hide'



            if (maskPathList[currentMaskNum].length > 1) {
                maskPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index > 0) {
                            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][index], true) + '")'
                        }
                    }, (audioList.bodyAudio1.duration * 1000 + 1000) / maskPathList[currentMaskNum].length * index);
                }
                )
            }

            setTimeout(() => {

                if (marginPosList[currentMaskNum].s) {
                    currentImage.current.style.transform =
                        "translate(" + _baseGeo.width * maskTransformList[currentMaskNum].s * (0.02 -
                            0.04 * marginPosList[currentMaskNum].l) / 2 + "px,"
                        + _baseGeo.height * maskTransformList[currentMaskNum].s * (0.02
                            - 0.04 * marginPosList[currentMaskNum].t) / 2 + "px)"
                        + "scale(1.04) "
                }

                audioList.bodyAudio1.play().catch(error => { });
                if (isSubAudio)
                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            audioList.bodyAudio3.play();
                        }, 500);
                    }, audioList.bodyAudio1.duration * 1000 + 500);

                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 1) {
                        audioList.bodyAudio1.src = prePathUrl() + getAudioPath('intro', audioPathList[currentMaskNum + 1][0]);
                        if (audioPathList[currentMaskNum + 1].length > 1)
                            audioList.bodyAudio3.src = prePathUrl() + getAudioPath('intro', audioPathList[currentMaskNum + 1][1]);
                    }

                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskPathList.length - 1) {
                                setTimeout(() => {
                                    baseObject.current.style.transition = '2s'

                                    baseObject.current.style.transform =
                                        'translate(' + '0%,0%)' +
                                        'scale(1)'

                                    setTimeout(() => {
                                        nextFunc()
                                    }, 5000);

                                }, 2000);
                            }
                            else {
                                currentMaskNum++;
                                blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                    returnImgPath(maskPathList[currentMaskNum][0], true) + '")'
                                blackWhiteObject.current.className = 'hide'
                                setTimeout(() => {
                                    showIndividualImage()
                                }, 2000);

                            }
                        }, 500);
                    }, 2000);
                }, timeDuration);
            }, 1000);

        }, durationList[currentMaskNum] * 1000);
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
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
                            src={returnImgPath('01a', true)}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <div
                            ref={currentImage}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <BaseImage
                                url={returnImgPath('01')}
                            />

                            {/* {
                        outLineRefList.map(
                            (value, index) =>
                                <BaseImage
                                    className='hideObject'
                                    ref={outLineRefList[index]}
                                />
                        )

                    } */}

                        </div>
                    </div>
                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <BaseImage
                            onLoad={bgLoaded}
                            url={returnImgPath('01')}
                        />
                    </div>
                </div>}
        </div>
    );
});

export default Scene;
