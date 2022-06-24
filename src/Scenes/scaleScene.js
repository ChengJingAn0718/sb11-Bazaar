import React, { useState, useRef, useContext } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl, setExtraVolume } from "../components/CommonFunctions";
import { MaskComponent } from "../components/CommonComponents"

let currentMaskNum = 0;
let subMaskNum = 0;
const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, _startTransition, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()

    const maskPathList = [
        ['sub'],
        ['00'],
        ['05'],
        ['sub'],
        ['06'],
        ['sub'],
        ['sub'],
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

    const subMarkInfoList = [
        [
            { p: '02', t: 1000, ps: 0, pl: 0.0, pt: 0.0 },
            { p: '03', t: 3000, ps: 0, pl: 0.0, pt: 0.0 },
            { p: '04', t: 4300, ps: 0, pl: 0.0, pt: 0.0 },
        ],
        [
            { p: '06', t: 2500, ps: 0, pl: 0.0, pt: 0.0 },
            { p: '07', t: 5000, ps: 0, pl: 0.0, pt: 0.0 },
        ],
        [
            { p: '13', t: 2800, ps: 0, pl: 0.0, pt: 0.0 },
            { p: '15', t: 4000, ps: 0, pl: 0.0, pt: 0.0 },
            { p: '14', t: 5000, ps: 0, pl: 0.0, pt: 0.0 },
        ],
        [
            { p: '09', t: 2500, ps: 0, pl: 0.0, pt: 0.0 },
            { p: '10', t: 4000, ps: 0, pl: 0.0, pt: 0.0 },
        ],
    ]

    const marginPosList = [
        {},
        {},
        { s: 1, l: 0.1, t: 0.2 },
        {},
        { s: 1, l: -0.2, t: 0.0 },

        {}, //vagetable
        {},
        { s: 1, l: -0.1, t: 0.2 }, // 9
        {},
    ]

    const audioPathList = [
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
        ['7'],
        ['8'],
        ['9'],
        ['10', '11'],
    ]

    const bodyAudioList = [audioList.bodyAudio1, audioList.bodyAudio2, audioList.bodyAudio3, audioList.bodyAudio4]


    const [isSubMaskLoaded, setSubMaskLoaded] = useState(false)
    const subMaskRefList = Array.from({ length: 3 }, ref => useRef())

    const [isSceneLoad, setSceneLoad] = useState(false)


    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            baseObject.current.className = 'aniObject'
            audioList.bodyAudio1.src = getAudioPath('intro', audioPathList[currentMaskNum][0]);
            audioList.bodyAudio2.src = getAudioPath('intro', '1');

            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                returnImgPath('00', true) + '")'

            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            setExtraVolume(audioList.bodyAudio2, 5)
            setTimeout(() => {
                setExtraVolume(audioList.bodyAudio1, 6)
            }, 2500);

            setTimeout(() => {
                setSubMaskLoaded(true)
                audioList.bodyAudio2.play()
                loadFunc()
                setTimeout(() => {
                    // nextFunc()
                    showIndividualImage()
                    setExtraVolume(audioList.bodyAudio2, 6)
                }, audioList.bodyAudio2.duration * 1000 + 1000);
            }, 3000);

        },
        sceneEnd: () => {
            currentMaskNum = 0;
            subMaskNum = 0;
            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/sb11_intro_' + imgName + '.png')
            : ('intro/sb11_intro_' + imgName + '.png');
    }

    const durationList = [
        2, 1.4, 1.4, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1
    ]
    function showIndividualImage() {
        blackWhiteObject.current.className = 'hideObject'
        let currentMaskName = maskPathList[currentMaskNum]

        baseObject.current.style.transition = durationList[currentMaskNum] + 's'

        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = 4000

            audioPathList[currentMaskNum].map((value, index) => {
                timeDuration += bodyAudioList[index].duration * 1000 + 500
            }
            )

            if (currentMaskName != 'sub') {
                blackWhiteObject.current.className = 'show'
                colorObject.current.className = 'hide'
            }
            else {
                subMarkInfoList[subMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index == 0)
                            colorObject.current.className = 'hide'
                        if (index > 0)
                            subMaskRefList[index - 1].current.setClass('hide')

                        subMaskRefList[index].current.setClass('appear')
                        if (value.ps != null) {
                            subMaskRefList[index].current.setStyle({
                                transform:
                                    "translate(" + _baseGeo.width * value.pl / 100 + "px,"
                                    + _baseGeo.height * value.pt / 100 + "px)"
                                    + "scale(" + (1 + value.ps / 100) + ") "
                            })

                        }
                    }, value.t);
                })
            }

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

                if (marginPosList[currentMaskNum].s != null) {
                    currentImage.current.style.transform =
                        "translate(" + _baseGeo.width * marginPosList[currentMaskNum].l / 100 + "px,"
                        + _baseGeo.height * marginPosList[currentMaskNum].t / 100 + "px)"
                        + "scale(" + (1 + marginPosList[currentMaskNum].s / 100) + ") "
                }


                let time = 0

                audioPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        bodyAudioList[index].play()
                    }, time);
                    time += bodyAudioList[index].duration * 1000 + 500
                })



                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 1)
                        audioPathList[currentMaskNum + 1].map((value, index) => {
                            bodyAudioList[index].src = getAudioPath('intro', value);
                        })

                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"
                        if (currentMaskName == 'sub') {
                            subMaskRefList.map(mask => {
                                if (mask.current) {
                                    mask.current.setStyle({
                                        transform: "scale(1)"
                                    })
                                }
                            })
                        }

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskPathList.length - 1) {
                                // if (currentMaskNum == 0) {
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

                                if (currentMaskName == 'sub') {
                                    subMaskRefList.map(mask => {
                                        if (mask.current) {

                                            setTimeout(() => {
                                                mask.current.setClass('hide')
                                            }, 500);
                                        }
                                    })
                                    subMaskNum++
                                }

                                currentMaskNum++;

                                currentMaskName = maskPathList[currentMaskNum]
                                if (currentMaskName != 'sub')
                                    blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                        returnImgPath(maskPathList[currentMaskNum], true) + '")'
                                else
                                    subMarkInfoList[subMaskNum].map((value, index) => {
                                        subMaskRefList[index].current.setMask(returnImgPath(value.p, true))
                                    })

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
                                returnImgPath('00', true)
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

                        </div>
                    </div>
                    {
                        isSubMaskLoaded && subMarkInfoList[0].map((value, index) =>
                            <MaskComponent
                                ref={subMaskRefList[index]}
                                maskPath={returnImgPath(value.p, true)}
                            />

                        )
                    }
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
