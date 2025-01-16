import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Text, useTheme, List, Button, FAB } from 'react-native-paper';
import { AuthContext } from 'auth/authProvider';
import { ProgressBar } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

const PlayerStatsScreen: React.FC = () => {
  const { player, checkUser } = useContext(AuthContext)!;
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player?.stats) {
      refreshPlayerStats();
    }
  }, []);

  const refreshPlayerStats = async () => {
    setLoading(true);
    try {
      await checkUser('detail'); // Refresh the player object with detailed data
    } catch (error) {
      console.error('Failed to refresh player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onSurface, marginTop: 10 }}>Refreshing player stats...</Text>
      </View>
    );
  }

  if (!player?.stats) {
    return (
      <View style={styles.container}>
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, marginBottom: 10 }}>
          No stats available.
        </Text>
        <FAB label="Refresh Stats" icon="refresh" onPress={refreshPlayerStats}>
          
        </FAB>
      </View>
    );
  }

  const { wins, losses, ties, rocksThrown, papersThrown, scissorsThrown } = player.stats;

  const totalGames = wins + losses + ties;
  const winPercentage = (wins / totalGames) || 0;
  const lossPercentage = (losses / totalGames) || 0;
  const tiePercentage = (ties / totalGames) || 0;

  const totalThrows = rocksThrown + papersThrown + scissorsThrown;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Horizontal Bar Chart */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Game win %
      </Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.primary, flex: winPercentage },
          ]}
        />
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.tertiary, flex: lossPercentage },
          ]}
        />
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.secondary, flex: tiePercentage },
          ]}
        />
      </View>
      <Text style={styles.legend}>
        <Text style={[styles.legendItem, { color: theme.colors.primary }]}>Wins { (100 *wins / totalGames).toFixed(0)}% </Text>
        <Text style={[styles.legendItem, { color: theme.colors.tertiary }]}>Losses {(100 * losses / totalGames).toFixed(0)}% </Text>
        <Text style={[styles.legendItem, { color: theme.colors.secondary }]}>Ties {0}%</Text>
      </Text>

      <List.Section>
        <List.Item title="Total Wins" description={wins.toString()} left={() => <List.Icon icon="trophy" />} />
        <List.Item title="Total Losses" description={losses.toString()} left={() => <List.Icon icon="close" />} />
        <List.Item title="Total Games" description={totalGames.toString()} left={() => <List.Icon icon="gamepad" />} />
      </List.Section>

      {/* Pie Chart */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Throws Breakdown
      </Text>
      <PieChart
        data={[
          {
            name: 'Rock',
            count: rocksThrown,
            color: "#6A7B8B",
            legendFontColor: theme.colors.onSurface,
            legendFontSize: 14,
          },
          {
            name: 'Paper',
            count: papersThrown,
            color: "#F4F4F4",
            legendFontColor: theme.colors.onSurface,
            legendFontSize: 14,
          },
          {
            name: 'Scissors',
            count: scissorsThrown,
            color: "#FF914D",
            legendFontColor: theme.colors.onSurface,
            legendFontSize: 14,
          }
        ]}
        width={Dimensions.get('window').width - 40}
        height={220}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=" throws"
        chartConfig = {{
          backgroundGradientFrom: "#1E2923",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#08130D",
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false // optional
        }}
      />

      {/* Totals List */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Totals
      </Text>
      <List.Section>
        <List.Item title="Rocks Thrown" description={rocksThrown.toString()} left={() => <List.Icon icon="terrain" />} />
        <List.Item title="Papers Thrown" description={papersThrown.toString()} left={() => <List.Icon icon="receipt" />} />
        <List.Item title="Scissors Thrown" description={scissorsThrown.toString()} left={() => <List.Icon icon="content-cut" />} />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  barContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 5,
    textAlign: 'center',
  },
  legendItem: {
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default PlayerStatsScreen;
