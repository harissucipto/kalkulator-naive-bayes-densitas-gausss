import React, { Component } from 'react';

const inputStyle = {
  marginRight: '10px'
};

export default class TambahData extends Component {
  state = {
    akreditasi: 'A',
    fisika: 85,
    kimia: 83,
    biologi: 87,
    matematika: 82,
    bindo: 80,
    bing: 84,
    sertifikat: 10
  };

  changeState = (key, evt) => {
    const { value } = evt.target;
    this.setState({ [key]: value });
  };

  handleKlasifikasi = () => {
    const {
      akreditasi,
      fisika,
      kimia,
      biologi,
      matematika,
      bindo,
      bing,
      sertifikat
    } = this.state;

    const inputData = [
      akreditasi.toUpperCase(),
      Number(fisika),
      Number(kimia),
      Number(biologi),
      Number(matematika),
      Number(bindo),
      Number(bing),
      Number(sertifikat)
    ];
    this.props.onLakukanKlasifikasi(inputData);
  };

  render() {
    return (
      <div>
        <p>Masukan Data</p>
        <input
          value={this.state.akreditasi}
          onChange={e => this.changeState('akreditasi', e)}
          placeholder="akreditasi"
          style={inputStyle}
        />
        <input
          value={this.state.fisika}
          onChange={e => this.changeState('fisika', e)}
          placeholder={'fisika'}
          type="number"
          style={inputStyle}
        />
        <input
          value={this.state.kimia}
          onChange={e => this.changeState('kimia', e)}
          placeholder="kimia"
          type="number"
          style={inputStyle}
        />
        <input
          value={this.state.biologi}
          onChange={e => this.changeState('biologi', e)}
          placeholder="biologi"
          type="number"
          style={inputStyle}
        />
        <input
          value={this.state.matematika}
          onChange={e => this.changeState('matematika', e)}
          placeholder="matematika"
          type="number"
          style={inputStyle}
        />
        <input
          value={this.state.bindo}
          onChange={e => this.changeState('bindo', e)}
          placeholder="bindo"
          type="number"
          style={inputStyle}
        />
        <input
          value={this.state.bing}
          onChange={e => this.changeState('bing', e)}
          placeholder="bing"
          type="number"
          style={inputStyle}
        />
        <input
          value={this.state.sertifikat}
          onChange={e => this.changeState('sertifikat', e)}
          placeholder="sertifikat"
          type="number"
          style={inputStyle}
        />
        <button onClick={this.handleKlasifikasi}>Lakukan Klasifikasi</button>
      </div>
    );
  }
}
