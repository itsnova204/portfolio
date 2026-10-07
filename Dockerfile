FROM denoland/deno:2.9.7

WORKDIR /app

COPY . .

# Build the Fresh production bundle during image creation.
RUN deno task build

EXPOSE 8000

CMD ["deno", "task", "preview"]
