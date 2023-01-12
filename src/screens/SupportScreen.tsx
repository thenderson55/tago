import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {UnorderedList} from '../components/HTML/UnorderedList';

function PrivacyPolicyScreen() {
  return (
    <ScrollView>
      <View style={styles.view}>
        <Text style={styles.header}>Support</Text>
        <Text style={styles.paragraph}>
          If you need help or have any questions, you can contact us at:
        </Text>
        <UnorderedList texts={['tombonaventure@protonmail.com']} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    margin: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 26,
    marginVertical: 15,
  },
  paragraph: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default PrivacyPolicyScreen;
