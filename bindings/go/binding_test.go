package tree_sitter_jarl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_jarl "github.com/vivanicc/tree-sitter-jarl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_jarl.Language())
	if language == nil {
		t.Errorf("Error loading Jarl grammar")
	}
}
