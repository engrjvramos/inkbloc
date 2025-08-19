import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type Props = {
  userName: string;
  verificationUrl: string;
};

const VerificationEmail = ({ userName, verificationUrl }: Props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your email address to complete your registration</Preview>
        <Body className="bg-gray-100 p-5 font-sans sm:p-10">
          <Container className="mx-auto max-w-[600px] bg-white p-5 sm:p-10">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] text-[32px] font-bold text-black">Verify Your Email</Heading>
              <Text className="m-0 text-[16px] text-gray-600">Complete your account setup</Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-800">Hello, {userName}</Text>
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-800">
                Thank you for creating an account with us. To complete your registration and secure your account, please
                verify your email address by clicking the button below.
              </Text>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-800">
                This verification link will expire in 24 hours for security purposes.
              </Text>
            </Section>

            {/* Verification Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={verificationUrl}
                className="box-border rounded-[8px] bg-black px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Verification Code */}
            {/* <Section className="bg-gray-50 border border-solid border-gray-200 rounded-[8px] px-[24px] py-[20px] mb-[32px]">
              <Text className="text-gray-800 text-[14px] mb-[8px] m-0">
                Or use this verification code:
              </Text>
              <Text className="text-black text-[24px] font-bold tracking-[4px] m-0">
                {verificationCode}
              </Text>
            </Section> */}

            {/* Security Notice */}
            <Section className="mb-[32px]">
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-600">
                <strong>Security Notice:</strong> If you didn&apos;t create an account with us, please ignore this
                email. Your email address will not be added to our system.
              </Text>
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-600">
                For security reasons, this verification link can only be used once and will expire in 24 hours.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
