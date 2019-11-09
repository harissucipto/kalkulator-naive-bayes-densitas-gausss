import React, { Component } from 'react';

export default class DataProbilitasKemunculan extends Component {
  render() {
    const {
      hasilDataTraining,
      hasilDataTrainingY,
      dataTraining
    } = this.props.klasifikasiData;
    console.log(this.props.klasifikasiData);
    return (
      <div>
        {hasilDataTraining.map((item, index) => {
          return (
            <div key={index}>
              <h3>
                Probabilitas Kemunculan setiap nilai untuk attribute{' '}
                {item.label}
              </h3>
              <div>
                <table border="2px">
                  <thead>
                    <tr>
                      {item.data.map((prob, probKey) => (
                        <th>{prob.labelY}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {item.data.map((prob, probKey) => (
                        <td key={probKey}>
                          {prob.dataX.map(dataX => (
                            <p>{dataX.value}</p>
                          ))}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      {item.data.map((prob, probKey) => (
                        <td key={probKey}>
                          <p>Mean: {prob.nilaiMean}</p>
                          <p>Deviasi Standart: {prob.deviasiStandar}</p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        <div>
          <div>
            <h3>
              Probabilitas Kemunculan setiap nilai untuk attribute{' '}
              {hasilDataTrainingY.label}
            </h3>
            <div>
              <table border="2px">
                <thead>
                  <tr>
                    {hasilDataTrainingY.data.map((prob, probKey) => (
                      <th>{prob.labelY}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {hasilDataTrainingY.data.map((prob, probKey) => (
                      <td key={probKey}>
                        {prob.dataX.map(dataX => (
                          <p>{dataX.value}</p>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {hasilDataTrainingY.data.map((prob, probKey) => (
                      <td key={probKey}>
                        <p>
                          Probabilitas: {prob.countDataX}/{dataTraining.length}{' '}
                          = {prob.probabilitas}
                        </p>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
