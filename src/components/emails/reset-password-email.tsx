import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type Props = {
  userName: string;
  userEmail: string;
  resetUrl: string;
};

const PasswordResetEmail = ({ userName, userEmail, resetUrl }: Props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required within 1 hour</Preview>
        <Body className="bg-gray-100 py-5 font-sans sm:py-[40px]">
          <Container className="mx-auto max-w-[600px] bg-white p-5 sm:p-10">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] text-[32px] font-bold text-black">Password Reset Request</Heading>
              <Text className="m-0 text-[16px] text-gray-600">Secure your account with a new password</Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-800">Hello, {userName}</Text>
              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-800">
                We received a request to reset the password for your account associated with{' '}
                <strong>{userEmail}</strong>.
              </Text>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-800">
                Click the button below to create a new password. This link will expire in 1 hour for your security.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={resetUrl}
                className="box-border rounded-[8px] bg-black px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
              >
                Reset Password
              </Button>
            </Section>

            {/* Alternative Method */}
            <Section className="mb-[32px]">
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-800">
                If the button doesn&apos;t work, copy and paste this link into your browser:
              </Text>
              <Text className="mb-[16px] text-[14px] leading-[20px] break-all text-gray-600">{resetUrl}</Text>
            </Section>

            <Hr className="my-[24px] border-gray-200" />

            {/* Security Information */}
            <Section className="mb-[32px]">
              <Heading className="mb-[16px] text-[18px] font-semibold text-black">Security Information</Heading>
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-600">
                • This password reset link expires in <strong>1 hour</strong>
              </Text>
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-600">
                • The link can only be used once
              </Text>
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-600">
                • If you didn&apos;t request this reset, please ignore this email
              </Text>
              <Text className="mb-[16px] text-[14px] leading-[20px] text-gray-600">
                • Your current password remains unchanged until you create a new one
              </Text>
            </Section>

            {/* Didn't Request Section */}
            <Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[20px]">
              <Text className="mb-[12px] text-[14px] leading-[20px] font-semibold text-gray-800">
                Didn&apos;t request a password reset?
              </Text>
              <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                If you didn&apos;t request this password reset, someone may be trying to access your account. Please
                contact our support team immediately and consider changing your password as a precaution.
              </Text>
            </Section>

            {/* Footer */}
            <Hr className="my-[24px] border-gray-200" />
            <Section>
              <Text className="m-0 mb-[8px] text-[12px] leading-[16px] text-gray-500">
                This email was sent to {userEmail}
              </Text>
              <Text className="m-0 text-[12px] leading-[16px] text-gray-500">
                © {new Date().getFullYear()} InkBloc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordResetEmail.PreviewProps = {
  userEmail: 'engrjvramos@gmail.com',
  resetToken: 'RST789ABC123DEF456',
};

export default PasswordResetEmail;
