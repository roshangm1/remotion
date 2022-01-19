/*
	Source code adapted from https://github.com/facebook/create-react-app/tree/main/packages/react-error-overlay and refactored in Typescript. This file is MIT-licensed.
*/

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** A container holding a script line. */
export class ScriptLine {
	/** The line number of this line of source. */
	lineNumber: number;
	/** The content (or value) of this line of source. */
	content: string;
	/** Whether or not this line should be highlighted. Particularly useful for error reporting with context. */
	highlight: boolean;

	constructor(lineNumber: number, content: string, highlight = false) {
		this.lineNumber = lineNumber;
		this.content = content;
		this.highlight = highlight;
	}
}

/**
 * A representation of a stack frame.
 */
export class StackFrame {
	functionName: string | null;
	fileName: string | null;
	lineNumber: number | null;
	columnNumber: number | null;

	_originalFunctionName: string | null;
	_originalFileName: string | null;
	_originalLineNumber: number | null;
	_originalColumnNumber: number | null;

	_scriptCode: ScriptLine[] | null;
	_originalScriptCode: ScriptLine[] | null;

	// eslint-disable-next-line max-params
	constructor(
		functionName: string | null = null,
		fileName: string | null = null,
		lineNumber: number | null = null,
		columnNumber: number | null = null,
		scriptCode: ScriptLine[] | null = null,
		sourceFunctionName: string | null = null,
		sourceFileName: string | null = null,
		sourceLineNumber: number | null = null,
		sourceColumnNumber: number | null = null,
		sourceScriptCode: ScriptLine[] | null = null
	) {
		if (functionName && functionName.indexOf('Object.') === 0) {
			functionName = functionName.slice('Object.'.length);
		}

		if (
			// Chrome has a bug with inferring function.name:
			// https://github.com/facebook/create-react-app/issues/2097
			// Let's ignore a meaningless name we get for top-level modules.
			functionName === 'friendlySyntaxErrorLabel' ||
			functionName === 'exports.__esModule' ||
			functionName === '<anonymous>' ||
			!functionName
		) {
			functionName = null;
		}

		this.functionName = functionName;

		this.fileName = fileName;
		this.lineNumber = lineNumber;
		this.columnNumber = columnNumber;

		this._originalFunctionName = sourceFunctionName;
		this._originalFileName = sourceFileName;
		this._originalLineNumber = sourceLineNumber;
		this._originalColumnNumber = sourceColumnNumber;

		this._scriptCode = scriptCode;
		this._originalScriptCode = sourceScriptCode;
	}

	/**
	 * Returns the source of the frame.
	 * This contains the file name, line number, and column number when available.
	 */
	getSource(): string {
		let str = '';
		if (this.fileName !== null) {
			str += this.fileName + ':';
		}

		if (this.lineNumber !== null) {
			str += this.lineNumber + ':';
		}

		if (this.columnNumber !== null) {
			str += this.columnNumber + ':';
		}

		return str.slice(0, -1);
	}
}