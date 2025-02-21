import XCTest
import SwiftTreeSitter
import TreeSitterJarl

final class TreeSitterJarlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_jarl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Jarl grammar")
    }
}
