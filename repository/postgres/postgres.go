// Package data - this user will only be granted READONLY access to the
// database. The database is written to by a different application and that
// application owns the schema.
package data

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/lib/pq"
)

// PGCustomerRepo -
type PGCustomerRepo struct {
	DbHandler *sql.DB
}

// NewPGCustomerRepo -
// Ignore unexpected type linter issue
// nolint:revive
func NewPGCustomerRepo(connString string) (*PGCustomerRepo, error) {
	conn, err := sql.Open("postgres", connString)
	if err != nil {
		return nil, err
	}

	return &PGCustomerRepo{
		DbHandler: conn,
	}, nil
}

// GetWords -
func (p *PGCustomerRepo) GetWords(ctx context.Context, difficulty string, count int) ([]string, error) {
	if count > 10 {
		count = 10
	}
	if count < 1 {
		count = 1
	}
	// sanitise difficulty
	switch difficulty {
	case "four", "five", "six":
	default:
		difficulty = "five"
	}

	// Find the max for the table
	countQuery := fmt.Sprintf("SELECT COUNT(id) FROM %s", difficulty)
	row := p.DbHandler.QueryRow(countQuery)
	var max int
	err := row.Scan(&max)
	if err != nil {
		log.Printf("ERROR fetching count of %s : %v", difficulty, err)
		return []string{}, fmt.Errorf("cannot get count of %s", difficulty)
	}

	// Random set of ids
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	ids := make([]int, count)
	for i := range ids {
		ids[i] = r1.Intn(max)
	}
	query := fmt.Sprintf("SELECT word FROM %s WHERE id = any($1)", difficulty)
	rows, err := p.DbHandler.Query(query, pq.Array(ids))
	if err != nil {
		return nil, fmt.Errorf(`unable to fetch words with error %w`, err)
	}
	defer rows.Close()

	words := []string{}
	var word sql.NullString
	for rows.Next() {
		err := rows.Scan(&word)
		if err != nil {
			log.Printf("Unable to scan word with error %v", err)
			continue
		}
		words = append(words, word.String)
	}
	return words, nil
}
