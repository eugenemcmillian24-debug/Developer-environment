import type { ProjectFile } from "@/types/project";

export function expoTemplate(projectName: string): ProjectFile[] {
  return [
    {
      path: "package.json",
      language: "json",
      content: JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, "-"),
        version: "1.0.0",
        main: "expo-router/entry",
        scripts: {
          start: "expo start",
          android: "expo start --android",
          ios: "expo start --ios",
        },
        dependencies: {
          expo: "~51.0.0",
          "expo-router": "~3.5.0",
          "expo-status-bar": "~1.12.1",
          react: "18.2.0",
          "react-native": "0.74.0",
        },
        devDependencies: {
          "@babel/core": "^7.24.0",
          typescript: "^5",
          "@types/react": "~18.2.45",
        },
      }, null, 2),
    },
    {
      path: "app/(tabs)/index.tsx",
      language: "tsx",
      content: `import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${projectName}</Text>
      <Text style={styles.subtitle}>Edit app/(tabs)/index.tsx to get started</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
});`,
    },
    {
      path: "app/_layout.tsx",
      language: "tsx",
      content: `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}`,
    },
    {
      path: "app.json",
      language: "json",
      content: JSON.stringify({
        expo: {
          name: projectName,
          slug: projectName.toLowerCase().replace(/\s+/g, "-"),
          version: "1.0.0",
          orientation: "portrait",
          scheme: "myapp",
        },
      }, null, 2),
    },
  ];
}
