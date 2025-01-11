import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Col, Container, Row} from "react-bootstrap"
import {getSurveyRandom} from "../services/survey/SurveyService";
import Survey from "../components/survey/Survey";

const ChoicePage = () => {
  // 설문중에 사용했던 설문 id
  const [choice, setChoice] = useState([]);
  const [selection, setSelection] = useState([]);
  // 나중에 디비에 설문 정보 넣을 데이터
  const [pushData, setPushData] = useState([]);
  //현재 가직있는 데이터
  const [nowData, setNowData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSurveyRandom().then(d => setNowData(d.data));
  }, []);

  useEffect(() => {
    console.log("pushData", pushData);
    console.log("length", choice.length);
    if(choice.length > 2){
      navigate('/result', {
        state: { selection, pushData }
      });
    }else if (choice.length > 0) {
      getSurveyRandom(choice).then(d => setNowData(d.data));
    }
  }, [choice]);

  useEffect(() => {
    if (nowData) {
      console.log("New Survey Data: ", nowData); // nowData가 업데이트될 때마다 실행
    }
  }, [nowData])

  const addChoiceAndPush = (choice, push, selection) => {
    console.log("addChoiceAndPush");
    setChoice(choicePrev => [...choicePrev, choice]);
    setPushData(pushPrev => [...pushPrev, push]);
    setSelection(selectionPrev => [...selectionPrev, selection]);
  };

  const handleSurveySelect = (question) => {
    nowData.selected = question;
    const findQuestion = question ? "question1" : "question0";
    addChoiceAndPush(nowData.id, nowData, nowData[findQuestion]);

  }

  return (
    <Container className="mt-5">
      <Row className="text-center mb-4">
        <Col>
          <h2 className="fw-bold text-dark">첫번째 선택지</h2>
        </Col>
      </Row>
      <Row>
        <Survey question={nowData?.question0} onSelect={() => handleSurveySelect(false)}></Survey>
        <Survey question={nowData?.question1} onSelect={() => handleSurveySelect(true)}></Survey>
      </Row>
    </Container>
  )
}

export default ChoicePage;