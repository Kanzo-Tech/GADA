import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

function expressionParser(tag: string) {
    return {
        get: function(scope: any, context: any) {
            if (tag === '.') return scope;

            const value = tag.split('.').reduce(function(prev, curr) {
                return prev ? prev[curr] : undefined;
            }, scope);
            
            if (typeof value === 'string' && value.trim().length === 0) {
                return undefined;
            }

            return value;
        }
    };
}

export async function POST(request: Request, documentToBeGenerated: string){
    try {
        const data = await request.json();
        const tempFolder = path.join(process.cwd(), 'temp');
        const versionValue = data.version;

        if (documentToBeGenerated === "dataspace-rb"){
            const templateRouteRulebook = path.join(process.cwd(), 'templates', 'Template_Rulebook_v1.docx');
            const rulebookContent = fs.readFileSync(templateRouteRulebook, 'binary');
            const rulebookZip = new PizZip(rulebookContent);
            const rulebookDoc = new Docxtemplater(rulebookZip, {
                paragraphLoop: true,
                linebreaks: true,
                parser: expressionParser,
                delimiters: { start: '[[', end: ']]'},
                nullGetter: function(field) {
                    return "___";
                }
            });
            try{
                await rulebookDoc.renderAsync(data);
            } catch (error) {
                console.error("Error while generating the docs: ", error);
                return NextResponse.json({ error: 'Error while generating the documents'}, {status: 500});
            }

            const wordRulebookGenerated = rulebookDoc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            const nameRulebookWord = 'Rulebook_' + versionValue + '.docx';
            const storageRouteRulebook = path.join(tempFolder, nameRulebookWord);
            fs.writeFileSync(storageRouteRulebook, wordRulebookGenerated);
            return NextResponse.json({status: 200})
        }

        if (documentToBeGenerated === "membership-agreement"){
            const templateRouteContract = path.join(process.cwd(), 'templates', 'Contrato_Adhesion_Institucional_v1.docx');
            const contractContent = fs.readFileSync(templateRouteContract, 'binary');
            const contractZip = new PizZip(contractContent);
            const contractDoc = new Docxtemplater(contractZip, {
                paragraphLoop: true,
                linebreaks: true,
                parser: expressionParser,
                delimiters: { start: '[[', end: ']]'},
                nullGetter: function(field) {
                    return "___";
                }
            });
            try{
                await contractDoc.renderAsync(data);
            } catch(error) {
                console.error("Error while generating the docs: ", error);
                return NextResponse.json({ error: 'Error while generating the documents'}, {status: 500});
            }
            
            const wordContractGenerated = contractDoc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            const nameContractWord = 'Contrato_Adhesion_Institucional_' + versionValue + '.docx';
            const storageRouteContract = path.join(tempFolder, nameContractWord);
            fs.writeFileSync(storageRouteContract, wordContractGenerated);
            return NextResponse.json({status: 200})
        }
        
        if (documentToBeGenerated === "general-tc"){
            const templateRouteTerms = path.join(process.cwd(), 'templates', 'Terminos_y_Condiciones_Template_v1.docx');
            const termsContent = fs.readFileSync(templateRouteTerms, 'binary');
            const termsZip = new PizZip(termsContent);
            const termsDoc = new Docxtemplater(termsZip, {
                paragraphLoop: true,
                linebreaks: true,
                parser: expressionParser,
                delimiters: { start: '[[', end: ']]'},
                nullGetter: function(field) {
                    return "___";
                }
            });
            try{
                await termsDoc.renderAsync(data);
            } catch(error) {
                console.error("Error while generating the docs: ", error);
                return NextResponse.json({ error: 'Error while generating the documents'}, {status: 500});
            }
            
            const wordTermsGenerated = termsDoc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });
            const nameTermsWord = 'Terminos_y_Condiciones_' + versionValue + '.docx';
            const storageRouteTerms = path.join(tempFolder, nameTermsWord);
            fs.writeFileSync(storageRouteTerms, wordTermsGenerated);
            return NextResponse.json({status: 200})
        }
        
        return NextResponse.json({ error: 'Something went wrong.'}, { status: 50 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 50 });
    }
}