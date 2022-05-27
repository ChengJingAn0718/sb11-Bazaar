import React, { useEffect, useRef, useContext, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';
import { UserContext } from '../../components/BaseShot';
import { getAudioPath, prePathUrl, setPrimaryAudio, setRepeatAudio, setRepeatType, startRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions";

import { textInfoList, iconList, optionPathList, iconPrefix } from "../../components/CommonVarariant"


let answerList = []

let optionList = [0, 1, 0, 1]
let optionType = 0;

const iconMovePosList = [
    [
        { left: "20%", top: '47%' },
        { left: "45%", top: '47%' },
        { left: "70%", top: '47%' }
    ],
    [
        { left: "25%", top: '47%' },
        { left: "60%", top: '47%' },
    ]
]

let correctNum = 0
let doneCount = 0

const optionSet = [
    [2, 3, 11],
    [12, 13],
    [4, 12, 7],
    [6, 0],
]


const posInfoList = [
    { x: 20, y: 40 },
    { x: 45, y: 40 },
    { x: 70, y: 40 },

    { x: 25, y: 70 },
    { x: 60, y: 70 },

    { x: 20, y: 40 },
    { x: 45, y: 40 },
    { x: 70, y: 40 },


    { x: 25, y: 70 },
    { x: 60, y: 70 },
]

let stepCount = 0;
let optionGroup = [3, 2, 3, 2]

let audioPathList = [
    ['13', '14', '16', '15'],
    ['17', '18', '19'],
    ['20', '21', '22', '23'],
    ['24', '26', '25'],
]

let timerList = []

const OptionScene = React.forwardRef(({ nextFunc, clickedFunc, _geo }, ref) => {

    const optionLength = optionPathList.length

    const audioList = useContext(UserContext)
    const parentObject = useRef();

    const textRefList = Array.from({ length: optionLength }, ref => useRef())
    const clickRefList = Array.from({ length: optionLength }, ref => useRef())
    const itemRefList = Array.from({ length: optionLength }, ref => useRef())

    const [isShowLastPart, setShowLastPart] = useState(false)

    useEffect(() => {
        setPositionFomart()

        return () => {
            answerList = []
            optionType = 0;
            stepCount = 0;
        }
    }, [])

    const clickFunc = (num) => {
        stopRepeatAudio();

        audioList.bodyAudio1.pause()
        audioList.bodyAudio2.pause()

        audioList.buzzAudio.pause();

        timerList.map(timer => clearTimeout(timer))

        clickRefList[num].current.style.transition = '0.5s'
        clickRefList[num].current.style.transform = 'scale(0.7)'

        setTimeout(() => {
            clickRefList[num].current.style.transform = 'scale(1)'
            setTimeout(() => {
                judgeFunc(num)
            }, 150);
        }, 100);

        setShowLastPart(true)
    }

    React.useImperativeHandle(ref, () => ({
        startGame: () => {
            audioList.bodyAudio1.src = getAudioPath('Option/q' + (stepCount + 1), audioPathList[stepCount][correctNum])
            audioList.bodyAudio2.src = getAudioPath('Option/q' + (stepCount + 1), audioPathList[stepCount][correctNum + 1])

            setPrimaryAudio(audioList.bodyAudio2)
            setRepeatAudio(audioList.commonAudio1)
            setRepeatType(1)


            timerList[0] = setTimeout(() => {
                audioList.bodyAudio1.play();
                timerList[1] = setTimeout(() => {
                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        startRepeatAudio()
                        audioList.commonAudio1.play();
                    }, audioList.bodyAudio2.duration * 1000 + 300);
                }, audioList.bodyAudio1.duration * 1000 + 600);
            }, 1500);
        }
    }))

    const setPositionFomart = () => {

        for (let i = 0; i < answerList.length; i++) {
            clickRefList[doneCount + i].current.style.left =
                posInfoList[answerList[i]].x + '%'
            clickRefList[doneCount + i].current.style.transition = '0s'
        }
    }

    const fomartFunc = () => {
        doneCount += optionGroup[stepCount]
        clickedFunc(1)

        setTimeout(() => {


            if (stepCount < 3) {
                parentObject.current.className = 'disapear'
                correctNum = 0;
                stepCount++;

                audioList.bodyAudio2.src = getAudioPath('Option/q' + (stepCount + 1), audioPathList[stepCount][correctNum + 1])
                audioList.bodyAudio1.src = getAudioPath('Option/q' + (stepCount + 1), audioPathList[stepCount][correctNum])

                setTimeout(() => {

                    optionType = optionList[stepCount]

                    getRandomAnswerList()

                    itemRefList.map((value, index) => {
                        if (index > doneCount - 1) {
                            if (stepCount != optionPathList.length - 1 && index < doneCount + optionGroup[stepCount]) {
                                if (index == doneCount)
                                    value.current.className = 'showObject'
                                clickRefList[index].current.className = 'showObject'
                            }
                            if (stepCount == optionPathList.length - 1) {
                                if (index == doneCount)
                                    value.current.className = 'showObject'
                                clickRefList[index].current.className = 'showObject'
                            }
                        }
                        else {
                            value.current.className = 'hideObject'
                            clickRefList[index].current.className = 'hideObject'
                        }
                    })

                    setPositionFomart();
                    parentObject.current.className = 'appear'
                    parentObject.current.style.pointerEvents = ''
                    timerList[0] = setTimeout(() => {
                        audioList.bodyAudio1.play();
                        timerList[1] = setTimeout(() => {
                            audioList.bodyAudio2.play();
                            timerList[2] = setTimeout(() => {
                                startRepeatAudio()
                                // audioList.commonAudio1.play();
                            }, audioList.bodyAudio2.duration * 1000 + 300);

                        }, audioList.bodyAudio1.duration * 1000 + 300);
                    }, 1500);

                }, 500);
            }

            else {
                setTimeout(() => {
                    nextFunc()
                    audioList.clapAudio.pause()
                    audioList.clapAudio.currentTime = 0;
                }, 2000);

            }
        }, 2000);
    }

    const getRandomAnswerList = () => {

        answerList = []
        let needLength = optionType == 0 ? 3 : 2;

        while (answerList.length != needLength) {
            let randomNumber = Math.floor(Math.random() * needLength);
            if (!answerList.includes(doneCount + randomNumber)) {
                answerList.push(doneCount + randomNumber)
            }
        }
    }

    if (answerList.length == 0)
        getRandomAnswerList()

    const judgeFunc = (num) => {
        
        timerList.map(timer => clearTimeout(timer))

        if (num == doneCount + correctNum) {

            parentObject.current.style.pointerEvents = 'none'
            clickRefList[num].current.style.pointerEvents = 'none'
            clickRefList[num].current.style.transition = '0.8s'

            clickRefList[num].current.style.left = iconMovePosList[optionType][correctNum].left
            clickRefList[num].current.style.top = iconMovePosList[optionType][correctNum].top


            correctNum++
            audioList.tingAudio.play();

            if (correctNum == answerList.length)
                setTimeout(() => {
                    fomartFunc()
                }, 1000);
            else {
                audioList.bodyAudio2.src = getAudioPath('Option/q' + (stepCount + 1), audioPathList[stepCount][correctNum + 1])
                timerList[0] = setTimeout(() => {
                    itemRefList[doneCount + correctNum].current.className = 'appear'
                    parentObject.current.style.pointerEvents = ''

                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        startRepeatAudio()
                        // audioList.commonAudio1.play();
                    }, audioList.bodyAudio2.duration * 1000 + 300);
                }, 2000);
            }
        }
        else {
            //wrong function...
            audioList.buzzAudio.currentTime = 0
            audioList.buzzAudio.play();
            timerList[3] = setTimeout(() => {
                audioList.bodyAudio2.currentTime = 0
                audioList.bodyAudio2.play();
            }, 1000);

        }
    }

    return (
        <div ref={parentObject}
            style={{
                position: "fixed", width: _geo.width + "px"
                , height: _geo.height + "px",
                left: _geo.left + 'px',
                top: _geo.top + 'px',
            }}
        >



            {
                optionPathList.map((value, index) =>
                    (isShowLastPart || index < 3) &&
                    <div
                        key={index}
                        ref={itemRefList[index]}
                        style={{
                            position: "absolute",
                            width: '100%'
                            , height: '100%',
                            left: 0 + '%',
                            top: '0%',
                            pointerEvents: 'none'
                        }}
                        className={index > 0 ? 'hideObject' : ''}
                    >

                        <BaseImage
                            scale={0.22}
                            posInfo={{
                                l: (posInfoList[index].x - 3) / 100,
                                b: 0.09
                            }}
                            ref={textRefList[index]}
                            url={"Option/" + value[0] + "/" + iconPrefix + value[2] + ".png"}
                        />



                    </div>
                )
            }

            {
                optionPathList.map((value, index) =>
                    (isShowLastPart || index < 3) &&
                    <div
                        className={index > 2 ? 'hideObject' : ''}
                        ref={clickRefList[index]}
                        onClick={() => { clickFunc(index) }}
                        style={{
                            position: 'absolute',
                            top: 30 + '%',
                            width: 17 + '%',
                            height: 30 + '%',
                            borderRadius: '50%',
                            left: posInfoList[index].x + 0 + '%',
                            top: '16%',
                            cursor: 'pointer',
                        }}>
                        <BaseImage
                            posInfo={{ l: 0, t: 0 }}
                            url={"Option/" + value[0] + "/" + iconPrefix + value[1] + ".png"}
                        />
                    </div>
                )
            }

        </div >
    );
});

export { OptionScene };
