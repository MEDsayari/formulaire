import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function MyChart() {
  const { formId } = useParams();
  const [chartData, setChartData] = useState([]);
  const [stat, setStat] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reponse/stat/${formId}`);
        setChartData(response.data.radioResponses);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchData();
  }, [formId]);

  useEffect(() => {
    const statsObject = chartData.map((chartItem) => {
      const question = chartItem.question;
      const stats = chartItem.stats;
      return { question, stats };
    });
    setStat(statsObject);
  }, [chartData]);

  return (
    <div className="chart-container" style={{ display: 'flex' }}>
      {stat.map((statItem, index) => (
        <div key={index} className="chart-item" style={{ width: '30%', height: '30%' }}>
          <h3>{statItem.question}</h3>
          <Pie
            data={{
              labels: statItem.stats.map((item) => item.value),
              datasets: [
                {
                  data: statItem.stats.map((item) => item.count),
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#2ECC71',
                    '#9B59B6',
                    '#F1C40F',
                  ],
                },
              ],
            }}
            options={{
              
             
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default MyChart;
