import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AuthField, BenefitCard, authStyles as styles } from "./auth";

export default function RegisterScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.heroCard}>
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
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Създай профил</Text>
          </Pressable>
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Вече имаш профил?</Text>
            <Link href="/auth" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.switchLink}>Влез</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <BenefitCard
          title="След регистрация"
          items={[
            "Добавяш любимци към профила",
            "Влизаш в групи с код за покана",
            "Предлагаш събития към мениджър",
          ]}
        />
      </View>
    </ScrollView>
  );
}