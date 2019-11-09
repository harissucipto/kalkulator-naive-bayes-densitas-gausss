import React, { Component } from 'react';

import { fungsiNaiveBayes } from '../Itung';
import { ambilData, simpanData } from '../utils';
import TambahData from './TambahData';
import TableData from './TableData';
import DataProbilitasKemunculan from './DataProbilitasKemunculan';
import LakukanKlasifikasi from './LakukanKlasifikasi';

export default class App extends Component {
  state = {
    data: [],
    klasifikasiData: {},
    hideHasilDataTraining: false
  };

  fetchData() {
    const data = ambilData() || [];
    this.setState({ data });
  }

  componentDidMount() {
    this.fetchData();
  }

  tambahData = value => {
    console.log(value);
    const { data } = this.state;
    const newData = [...data, value];
    simpanData(newData);
    this.setState({ data: newData });
  };

  hapusData = indexHapus => {
    const { data } = this.state;
    const newData = data.filter((item, index) => index !== indexHapus);
    simpanData(newData);
    this.setState({ data: newData });
  };

  trainingData = () => {
    const { data } = this.state;
    const klasifikasiData = fungsiNaiveBayes(data);
    klasifikasiData.trainingData();
    this.setState({ klasifikasiData });
  };

  render() {
    const { data, klasifikasiData, hideHasilDataTraining } = this.state;
    return (
      <div>
        <div>
          <h1>Naive Bayes</h1>
        </div>
        <TambahData onTambah={this.tambahData} />
        <TableData data={data} onHapusData={this.hapusData} />
        <div>
          <button onClick={this.trainingData}>Training Data</button>
        </div>
        {klasifikasiData.hasilDataTraining && (
          <div>
            {!hideHasilDataTraining && (
              <div>
                <DataProbilitasKemunculan klasifikasiData={klasifikasiData} />
                <div>
                  <h3>
                    Persentasi Akurat DataTraining:{' '}
                    {klasifikasiData.checkPersentasiKeAkuratan()}%
                  </h3>
                </div>
              </div>
            )}
            <LakukanKlasifikasi klasifikasiData={klasifikasiData} />
          </div>
        )}
      </div>
    );
  }
}
