import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function SubscriptionsScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Apollo's Gift");

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName);
    Alert.alert('Plan Selected', `You have selected the ${planName} plan.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Choose Your Apollo Plan</Text>

      {/* Basic Plan */}
      <View style={[styles.planCard, styles.basicPlan]}>
        <Text style={styles.planTitle}>
          Apollo's Gift {selectedPlan === "Apollo's Gift" && '(Selected Tier)'}
        </Text>
        <Text style={styles.planPrice}>Free</Text>
        <Text style={styles.planDescription}>
          Get started with the basic plan. Includes core features for detecting chords.
        </Text>
        <TouchableOpacity
          style={[styles.planButton, styles.basicButton]}
          onPress={() => handlePlanSelection("Apollo's Gift")}
        >
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>

      {/* Pro Plan */}
      <View style={[styles.planCard, styles.proPlan]}>
        <Text style={styles.planTitle}>
          Apollo's Lyre {selectedPlan === "Apollo's Lyre" && '(Selected Tier)'}
        </Text>
        <Text style={styles.planPrice}>$9.99/month</Text>
        <Text style={styles.planDescription}>
          Unlock advanced features, including higher accuracy and customization options.
        </Text>
        <TouchableOpacity
          style={[styles.planButton, styles.proButton]}
          onPress={() => handlePlanSelection("Apollo's Lyre")}
        >
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>

      {/* Enterprise Plan */}
      <View style={[styles.planCard, styles.enterprisePlan]}>
        <Text style={styles.planTitle}>
          Apollo's Temple {selectedPlan === "Apollo's Temple" && '(Selected Tier)'}
        </Text>
        <Text style={styles.planPrice}>$49.99/month</Text>
        <Text style={styles.planDescription}>
          Designed for professionals and enterprises. Includes API access, advanced analytics, and
          premium support.
        </Text>
        <TouchableOpacity
          style={[styles.planButton, styles.enterpriseButton]}
          onPress={() => handlePlanSelection("Apollo's Temple")}
        >
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  planCard: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#25292e',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  planDescription: {
    fontSize: 16,
    color: '#444',
    marginBottom: 15,
  },
  planButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  basicPlan: {
    backgroundColor: '#df6f84',
  },
  basicButton: {
    backgroundColor: '#1a1a1a',
  },
  proPlan: {
    backgroundColor: '#b06694',
  },
  proButton: {
    backgroundColor: '#1a1a1a',
  },
  enterprisePlan: {
    backgroundColor: '#786091',
  },
  enterpriseButton: {
    backgroundColor: '#1a1a1a',
  },
});
