# Use the official Golang image to build the binary
FROM golang:1.22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go source file from the correct location
COPY . .

# Build the Go binary
RUN go build -o main ./save_server

# Use a minimal Alpine image for the final container
FROM alpine:latest

# Install wget for health checks
RUN apk add --no-cache wget

# Set the working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/save_server/sql/schema ./migrations 

#TODO(mark): do i want to remove this?
# Expose the port the app runs on
ENV PORT=8080
EXPOSE 8080

# Run the binary
CMD ["./main"]
