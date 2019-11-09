import React, { Component } from 'react';
import InputCobaKlasifikasi from './InputCobaKlasifikasi';

export default class LakukanKlasifikasi extends Component {
  state = {
    hasilK: {}
  };

  onLakukanKlasifikasi = value => {
    const { klasifikasiData } = this.props;
    const hasilK = klasifikasiData.cariKlasifikasi(value);
    this.setState({ hasilK });
  };

  render() {
    const { hasilK } = this.state;
    return (
      <div>
        <h2>
          Coba Lakukan Klasfikasi Status Kelulusan Berdasarkan Data Training
        </h2>
        <InputCobaKlasifikasi
          onLakukanKlasifikasi={this.onLakukanKlasifikasi}
        />
        {hasilK.keputusan && (
          <div>
            {' '}
            <p>hasilnya: {hasilK.keputusan.label}</p>
            <div>
              <h4>Berdasarkan Data Distribusi Normal:</h4>
              {hasilK.dataDistribusiNormal.map((item, i) => (
                <div key={i}>
                  <p>{item.label}</p>
                  <div>
                    {item.data.map(thing => (
                      <div key={thing.labelY}>
                        {thing.labelY} = {thing.nilaiDistribusiNormal}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4>Berdasarkan Data Likehood:</h4>
              {hasilK.dataLikehood.map((likehood, i) => (
                <div key={i}>
                  <p>
                    Likehood {likehood.label} ={' '}
                    {likehood.arrayLikeHood.join(' x ')}
                  </p>
                  <p>= {likehood.nilaiLikehood}</p>
                </div>
              ))}
            </div>
            <div>
              <h4>Nilai Probabiltas</h4>
              {hasilK.dataLikehood.map((likehood, i) => (
                <div key={i}>
                  <p>
                    Probabilitas {likehood.label} = {likehood.nilaiLikehood} /{' '}
                    {likehood.totalNilaiLikeHood}
                  </p>
                  <p>= {likehood.hasilNilaiLikehood}</p>
                </div>
              ))}
            </div>
            <div>
              <h4>Keputusan</h4>
              <div>{hasilK.keputusan.hasil}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
