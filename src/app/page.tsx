import { MFA } from "@/components/MFA";
import { Center, Container, Space, Text, Title } from "@mantine/core";

const Home = () => {
  return (
    <main>
      <Container>
        <Title my="xl" ta="center">
          Easy MFA
        </Title>
        <Text size="xs" ta="center">
          Please Paste Your Code
        </Text>
        <MFA />
      </Container>
    </main>
  );
};

export default Home;
