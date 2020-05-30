import React, {useEffect, useState} from 'react';
import './App.css';

import { historyService, Record } from "./services/historyService";

function App() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputPrice, setInputPrice] = useState('');

  useEffect(() => {
    if (historyService.getRecords().length === 0) {
        let initialCash;
        while (!initialCash && (initialCash !== 0)) {
            initialCash = Number(prompt('First time? Write you available cash!'));
        }
        historyService.updateMoneyStats({
            available: initialCash,
            earned: 0,
            wasted: 0
        });
    }
    if (historyService.isLastRecordOutdated()) {
      historyService.pushRecord(new Record());
    }
    setCurrentRecord(historyService.getLastRecord());
  }, []);

  const handleAddAction = () => {
      const tempMoneyStats = {
          ...historyService.getMoneyStats()
      };
      tempMoneyStats.available += Number(inputPrice);
      if (Number(inputPrice) < 0) {
          tempMoneyStats.wasted -= Number(inputPrice);
      } else {
          tempMoneyStats.earned += Number(inputPrice);
      }
      historyService.updateMoneyStats(tempMoneyStats);
      currentRecord.pushAction(inputName, inputDescription, Number(inputPrice));
      historyService.updateStoredRecords(historyService.getRecords());
      setCurrentRecord(Object.create(currentRecord));
  };

  return (<div className="App">
      {
          currentRecord &&
              <>
                  <ul className='dateList'>
                      {
                          historyService.getRecords().map(record => {
                              return (
                                  <li
                                      className='dateList__item'
                                      key={record.getDateString()}
                                      onClick={() => setCurrentRecord(record)}
                                  >
                                      {record.getDateString()}
                                  </li>
                              );
                          })
                      }
                  </ul>
                  Stats for all time: <br/>
                  wasted: { historyService.getMoneyStats().wasted } <br/>
                  earned: { historyService.getMoneyStats().earned } <br/>
                  available: { historyService.getMoneyStats().available } <br/>
                  <br/>
                  Stats for today: <br/>
                  wasted: { currentRecord.getMoneyStats().wasted } <br/>
                  earned: { currentRecord.getMoneyStats().earned } <br/>
                  available: { currentRecord.getMoneyStats().available } <br/>

                  <br/>
                  <br/>
                  Create action: <br/>
                  <label>
                      Name: <input onChange={(e) => setInputName(e.target.value)} type='text'/>
                  </label>
                  <br />
                  <label>
                      Description: <input onChange={(e) => setInputDescription(e.target.value)} type='text'/>
                  </label>
                  <br />
                  <label>
                      Money changes: <input onChange={(e) => setInputPrice(e.target.value)} type='text'/>
                  </label>
                  <button onClick={handleAddAction}>Add Action</button>
                  <br />
                  <br />
                  {
                      currentRecord.actions.map(action => {
                          return <div key={action.name + action.description + action.price}>
                              name: { action.name }
                              description: { action.description }
                              money changed: { action.price }
                              <br />
                              <br />
                              <br />
                          </div>;
                      })
                  }
              </>
      }
  </div>);
}

export default App;
