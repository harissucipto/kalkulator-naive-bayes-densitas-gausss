import { mean, sampleStandardDeviation } from 'simple-statistics';

export default class klasifikasiData {
  constructor(dataTraining, opsiData, objFungsiEktrakData = {}) {
    this.dataTraining = dataTraining;
    this.opsiData = opsiData;
    this.objFungsiEktrakData = objFungsiEktrakData;
    this.konversiDataTraining = [];
    this.hasilDataTraining = [];
    this.hasilDataTrainingY = [];
    this.indexY = dataTraining[0].length - 1;
  }

  konversiNilai(array, objPerubah) {
    // lakukan ubah tiap baris
    return array.map(item => {
      // terapakn objPerubah pada tiap kolom
      return item.map((nilai, index) => {
        // jika ada dalam objPerubah
        if (objPerubah[index]) {
          // lakukan perubahan
          return objPerubah[index](nilai);
        }
        // jika itdak kembalikan nilai
        return nilai;
      });
    });
  }

  ekstrakData(data, kolomTabel, indexY) {
    const cariDistribusiNormal = (x, mean, deviasiStandart) => {
      const pangkat = -(
        Math.pow(x - mean, 2) /
        (2 * Math.pow(deviasiStandart, 2))
      );
      const kanan = Math.pow(Math.E, pangkat);
      const kiri = 1 / (Math.sqrt(2 * Math.PI) * deviasiStandart);

      return kiri * kanan;
    };

    const indexX = kolomTabel.index;
    // data Y yang mau dicari
    const konstaY = [...new Set(data.map(item => item[indexY])).keys()];

    // caro milai X pada tiap Y
    const dataY = konstaY.map(label => {
      // filter x jika sesuai dengan Y
      const dataX = data
        .filter(item => item[indexY] === label)
        .map((item, nomor) => ({ index: nomor, value: item[indexX] }));

      // ambil nilai x
      const valuesX = dataX.map(item => item.value);

      const nilaiMean = valuesX.length ? mean(valuesX) : 0;

      const deviasiStandar = valuesX.length
        ? sampleStandardDeviation(valuesX)
        : 0;

      return {
        labelY: label,
        konstaY,
        dataX,
        nilaiMean,
        deviasiStandar,
        hitungDistribusiNormal: x => {
          return cariDistribusiNormal(x, nilaiMean, deviasiStandar);
        }
      };
    });

    const { label, index } = kolomTabel;
    return { index, label, data: dataY };
  }

  trainingData() {
    const { dataTraining, opsiData, objFungsiEktrakData } = this;
    const indexY = dataTraining[0].length - 1;
    const konversiDataTraining = this.konversiNilai(
      dataTraining,
      objFungsiEktrakData
    );

    if (!opsiData) {
      throw new Error('Kamu harus memasukan opsi data pada konstruktor');
    }

    const olahDataTraining = opsiData
      .map(kolom => this.ekstrakData(konversiDataTraining, kolom, indexY))
      .filter(item => item.index !== indexY);

    this.konversiDataTraining = konversiDataTraining;
    this.hasilDataTraining = olahDataTraining;
    this.hasilDataTrainingY = this.ekstrakDataY();
    this.indexY = indexY;
  }

  ekstrakDataY() {
    const { indexY, dataTraining, opsiData } = this;
    const dataY = dataTraining.map(item => item[indexY]);
    const jumlahDataY = dataY.length;
    const golongkan = dataY.reduce((acc, value) => {
      acc[value] = acc[value] + 1 || 1;
      return acc;
    }, {});

    const data = Object.keys(golongkan).map(item => ({
      labelY: item,
      dataX: dataY
        .map((value, index) => ({ value, index }))
        .filter(data => data.value === item),
      countDataX: golongkan[item],
      probabilitas: golongkan[item] / jumlahDataY
    }));

    return {
      index: indexY,
      label: opsiData.find(item => item.index === indexY).label,
      data
    };
  }

  cariLikeHood(dataDistribusiNormal) {
    const { indexY, konversiDataTraining } = this;

    const sumKali = data => {
      const [head, ...tail] = data;
      return tail.reduce((acc, value) => acc * value, head);
    };

    const konstaY = [
      ...new Set(konversiDataTraining.map(item => item[indexY])).keys()
    ];

    const dataMentahLikehood = konstaY
      .map((labelY, index) => {
        const arrayLikeHood = dataDistribusiNormal.map(value => {
          const data = value.data.find(item => item.labelY === labelY);
          const nilai = data ? data.nilaiDistribusiNormal : 0;
          return nilai;
        }, 0);

        return {
          index,
          label: labelY,
          arrayLikeHood
        };
      })
      .map(item => {
        // tambahakn dataY
        const dataY = this.hasilDataTrainingY.data.find(
          y => y.labelY === item.label
        );
        return {
          ...item,
          arrayLikeHood: [...item.arrayLikeHood, dataY.probabilitas]
        };
      });

    const dataLikehood = dataMentahLikehood.map(likehood => {
      const { arrayLikeHood } = likehood;
      const nilaiLikehood = sumKali(arrayLikeHood);

      return {
        ...likehood,
        nilaiLikehood
      };
    });

    return dataLikehood;
  }

  menentukanGolongan(dataLikehood) {
    // const semuanyaTidak0
    const isSemuanya0 = dataLikehood.every(item => item.nilaiLikehood === 0);
    if (isSemuanya0)
      return {
        hasil:
          'Tidak bisa digolongkan karena tidak cocok berada pada label manapun karena nilai data 0 semua'
      };

    const [head, ...tail] = dataLikehood;

    const palingTinggi = tail.reduce((acc, value) => {
      if (acc.nilaiLikehood > value.nilaiLikehood) {
        return acc;
      }
      return value;
    }, head);

    const hasil = `menunjukan golongan ${palingTinggi.label}`;

    return {
      ...palingTinggi,
      hasil
    };
    // undefined !== tidak ada
    // kalau ada label data
  }

  tentukanKlasifikasi(dataSoal) {
    const { hasilDataTraining } = this;
    if (!hasilDataTraining.length || !hasilDataTraining) {
      throw new Error('kamu harus melakukan traingin data Terlebih dahulu!');
    }

    // hitung tiap kolom dataDistrubis normal
    const dataDistribusiNormal = dataSoal.map((nilaiSoal, index) => {
      const itemDN = { ...hasilDataTraining[index] };
      return {
        ...itemDN,
        data: itemDN.data.map(item => ({
          ...item,
          nilaiDistribusiNormal: item.hitungDistribusiNormal(nilaiSoal)
        }))
      };
    });

    const dataLikehood = this.cariLikeHood(dataDistribusiNormal);
    const keputusan = this.menentukanGolongan(dataLikehood);

    return {
      dataSoal,
      dataDistribusiNormal,
      dataLikehood,
      keputusan
    };
  }

  checkPersentasiKeAkuratan() {
    const { konversiDataTraining, hasilDataTraining } = this;
    if (!hasilDataTraining || !hasilDataTraining.length) {
      throw new Error('Perlu lakukan traingin data terlebih dahulu');
    }
    const hasil = konversiDataTraining
      .map(item => {
        const indexTerakhir = item.length - 1;
        return item.slice(0, indexTerakhir);
      })
      .map(persoal => {
        return this.tentukanKlasifikasi(persoal);
      })
      .map(item => item.keputusan.label);

    const persentasi =
      (konversiDataTraining.reduce((acc, value, index) => {
        const nilai = value[value.length - 1];
        if (nilai === hasil[index]) {
          return acc + 1;
        }
        return acc;
      }, 0) /
        hasil.length) *
      100;
    return persentasi;
  }

  cariKlasifikasi(soal) {
    const { objFungsiEktrakData, indexY } = this;

    if (!soal || !soal.length || soal.length < indexY) {
      throw new Error('Soal harus ada !');
    }

    const soalTanpaY = soal.slice(0, indexY);

    const konversiSoal = this.konversiNilai([soalTanpaY], objFungsiEktrakData);
    return this.tentukanKlasifikasi(konversiSoal[0]);
  }
}

const kepalaTable2 = [
  {
    index: 0,
    label: 'akreditasi sekolah'
  },
  {
    index: 1,
    label: 'fisika'
  },
  {
    index: 2,
    label: 'kimia'
  },
  {
    index: 3,
    label: 'biologi'
  },
  {
    index: 4,
    label: 'matematika'
  },
  {
    index: 5,
    label: 'b.indo'
  },
  {
    index: 6,
    label: 'b.ing'
  },
  {
    index: 7,
    label: 'sertifikat'
  },
  {
    index: 8,
    label: 'status'
  }
];

const kamusKonverSiData2 = {
  A: 5,
  B: 4
};

const fungsiRubahData2 = {
  0: x => kamusKonverSiData2[`${x}`]
};

export const fungsiNaiveBayes = dataTraining =>
  new klasifikasiData(dataTraining, kepalaTable2, fungsiRubahData2);
