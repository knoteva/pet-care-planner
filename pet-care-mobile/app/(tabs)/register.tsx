import { Pressable, ScrollView, Text, View } from "react-native";

import { AuthField, authStyles as styles } from "./auth";

export default function RegisterScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Нов профил</Text>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>
            Създай профил за участие в групи, събития и грижа за любимци.
          </Text>
        </View>

        <View style={styles.card}>
          <AuthField label="Име" placeholder="Мария Петкова" />
          <AuthField label="Имейл" placeholder="maria@example.com" />
          <AuthField label="Парола" placeholder="Минимум 8 символа" secure />
          <AuthField
            label="Потвърди парола"
            placeholder="Повтори паролата"
            secure
          />
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Създай профил</Text>
          </Pressable>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>След регистрация</Text>
          <Text style={styles.benefitItem}>✓ Добавяш любимци към профила</Text>
          <Text style={styles.benefitItem}>
            ✓ Влизаш в групи с код за покана
          </Text>
          <Text style={styles.benefitItem}>
            ✓ Предлагаш събития към мениджър
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
