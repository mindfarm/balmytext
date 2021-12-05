package data

import "context"

// Store -
type Store interface {
	GetWords(ctx context.Context, difficulty string, count int) ([]string, error)
}
