import React from "react";
import { useSelector } from "react-redux";
import { ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ChartContainer } from "./ProgressChartStyles";
import { Colors } from "../../styles/AppStyles";

const ProgressChartComponent = ({ chartColors }) => {
  const { categoryData } = useSelector(state => state.monthlyStats);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const containerWidth = screenWidth * 0.89;
  const containerHeight = screenHeight * 0.26;

  const { white } = Colors;

  // Extraer progreso y calcular datos de cada categoría
  const progressData = categoryData.map(category => {
    const goal = category.goal || 1; // Asegurar que no haya divisiones por 0
    const progress = Math.min(category.totalMinutes / goal, 1); // Limitar al 100%
    return progress;
  });

  const labels = categoryData.map(category => category.name); // Nombres de las categorías

  const chartData = {
    labels, // Etiquetas de las categorías
    data: progressData // Progreso de cada categoría (0 a 1)
  };

  const chartConfig = {
    backgroundGradientFrom: white,
    backgroundGradientTo: white,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 8 // Espesor de las líneas
  };

  return (
    <ChartContainer>
      <ProgressChart
        data={chartData}
        width={containerWidth}
        height={containerHeight}
        strokeWidth={16} // Espesor de los anillos
        radius={32} // Radio del círculo interno
        chartConfig={chartConfig}
        hideLegend={false} // Mostrar leyendas
      />
    </ChartContainer>
  );
};

export default ProgressChartComponent;
