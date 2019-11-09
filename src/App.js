import React, { useState, useCallback } from 'react';
import { mean, sampleStandardDeviation } from 'simple-statistics';
import roundTo from 'round-to';

function App() {
  const [data, setData] = useState([]);
  const [jumlahData, setJumlahData] = useState(0);
  const [meanValue, setMean] = useState(0);
  const [deviasiStandartValue, setDeviasiStandart] = useState(0);
  const [x, setX] = useState(0);
  const [distribusiNormalValue, setDistribusiNormal] = useState(0);

  const onBuatData = useCallback(() => {
    const data = Array(Number(jumlahData)).fill(0);
    setData(data);
  }, [jumlahData]);

  const masukanData = useCallback(
    (e, index) => {
      const newValue = Number(e.target.value);
      setData(data =>
        data.map((value, id) => (id === index ? newValue : value))
      );
    },

    []
  );

  const cariData = useCallback(() => {
    setMean(mean(data));
    setDeviasiStandart(sampleStandardDeviation(data));
  }, [data]);

  const cariDistribusiNormal = useCallback(() => {
    setDistribusiNormal(normalDist(x, meanValue, deviasiStandartValue));
  }, [deviasiStandartValue, meanValue, x]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <h5>Kalkulator Distribusi Normal Naive Bayes</h5>
        <i>oleh: Haris Sucipto</i>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <p>1. Masukan Banyak Data</p>
        <input
          value={jumlahData}
          onChange={e => setJumlahData(e.target.value)}
        />
        <button onClick={onBuatData}>Buat Data</button>
      </div>
      {data.length > 0 && (
        <div>
          <p>2. Silahkan Masukan Data</p>
          {data.map((kolom, index) => (
            <input
              style={{
                display: 'block',
                padding: '10px',
                marginBottom: '10px'
              }}
              key={index}
              value={kolom}
              onChange={e => masukanData(e, index)}
            />
          ))}
          <button onClick={cariData}>
            Cari Mean dan Distribusi Normal(Sample)
          </button>
        </div>
      )}
      {meanValue > 0 && deviasiStandartValue > 0 && (
        <div>
          <p>
            Mean: {meanValue} atau {roundTo(meanValue, 3)}
          </p>
          <p>
            Deviasi Standart: {deviasiStandartValue} atau{' '}
            {roundTo(deviasiStandartValue, 3)}
          </p>

          <div style={{ marginBottom: '10px' }}>
            <p>3. Masukan X (nilai Soal) untuk mencari Distribusi normal</p>
            <input value={x} onChange={e => setX(e.target.value)} />
          </div>
          <button onClick={cariDistribusiNormal}>cari Distribusi normal</button>
        </div>
      )}
      {distribusiNormalValue > 0 && (
        <div>
          <p>
            Distribusi Normal: {distribusiNormalValue} atau{' '}
            {roundTo(distribusiNormalValue, 4)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;

const normalDist = (x, mean, deviasiStandart) => {
  const pangkat = -(Math.pow(x - mean, 2) / (2 * Math.pow(deviasiStandart, 2)));
  const kanan = Math.pow(Math.E, pangkat);
  const kiri = 1 / (Math.sqrt(2 * Math.PI) * deviasiStandart);

  return kiri * kanan;
};
