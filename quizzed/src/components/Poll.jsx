import React, {useState, useEffect, useContext} from 'react';
import Modal from 'react-modal';
import {Line} from 'rc-progress';
import {PollContext} from './PollContext';
import styles from './PollStyles';
import {NavItem} from 'react-bootstrap';
import ProgressBar from '@ramonak/react-progress-bar';
import chatContext, {controlMessageEnum} from './ChatContext';

const Poll = () => {
  const {
    question,
    setQuestions,
    answers: voteData,
    setAnswers,
    isModalOpen,
    setIsModalOpen,
  } = useContext(PollContext);
  const {sendControlMessage} = useContext(chatContext);
  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setTotalVotes(
      voteData.map((item) => item.votes).reduce((prev, next) => prev + next),
    );
  }, [voteData]);

  const submitVote = (e, chosenAnswer) => {
    if (!voted) {
      const newAnswers = voteData.map((answer) => {
        if (chosenAnswer.option === answer.option) {
          return {...answer, votes: answer.votes + 1};
        } else {
          return answer;
        }
      });
      setAnswers(newAnswers);
      sendControlMessage(controlMessageEnum.initiatePoll, {
        question,
        answers: newAnswers,
      });
      setTotalVotes((prevTotalVotes) => prevTotalVotes + 1);
      setVoted((prevVoted) => !prevVoted);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTotalVotes(0);
    setVoted(false);
    setQuestions('');
    setAnswers([
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
    ]);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      content="Poll Modal"
      style={styles.customStyles}>
      <div>
        <h1>{question}</h1>
        <div style={styles.flexColumn}>
          {voteData &&
            voteData.map((answer, i) =>
              !voted ? (
                <button
                  style={styles.button}
                  key={i}
                  onClick={(e) => submitVote(e, answer)}>
                  {answer.option}
                </button>
              ) : (
                <div
                  style={{
                    width: '100%',
                    borderColor: 'red',
                  }}
                  key={i}>
                  <h2 style={styles.mr20}>{answer.option}</h2>
                  <br></br>
                  <ProgressBar
                    completed={(answer.votes / totalVotes) * 100}
                    bgColor="blue"
                  />
                  <p style={styles.ml20}>{answer.votes}</p>
                </div>
              ),
            )}
        </div>
        <h3>Total Votes : {totalVotes}</h3>
      </div>
    </Modal>
  );
};

export default Poll;
