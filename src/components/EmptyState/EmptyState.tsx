import { EmptyState as AivenEmptyState, Box } from "@aivenio/aquarium";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../Layout/Layout";

interface Props {
  title: string;
}

export const EmptyState: React.FC<Props> = ({ title }) => {
  const router = useRouter();

  return (
    <Layout>
      <Box width="full">
        <AivenEmptyState
          image="https://images.ctfassets.net/33bglmnnbgh7/7B19D37GjCHxatmfrb4MBw/e74b0f0c717a4cf3588e9f7ad15aa38e/aiven-observability-image-composition_1.png"
          imageWidth={184}
          primaryAction={{
            onClick: () => router.reload(),
            text: "Try again",
          }}
          secondaryAction={{
            href: "/",
            text: "Back to home",
          }}
          title={title}
        />
      </Box>
    </Layout>
  );
};
