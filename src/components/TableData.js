import React, { Component } from 'react';

export default class TableData extends Component {
  render() {
    const { data, onHapusData } = this.props;
    return (
      <div>
        <table border="2px">
          <thead>
            <tr>
              <th>No</th>
              <th>akreditasi</th>
              <th>fisika</th>
              <th>kimia</th>
              <th>biologi</th>
              <th>matematika</th>
              <th>bindo</th>
              <th>bing</th>
              <th>sertifikat</th>
              <th>status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {item.map((baris, key) => (
                  <td key={key}>{baris}</td>
                ))}
                <td>
                  <button onClick={() => onHapusData(index)}>hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
