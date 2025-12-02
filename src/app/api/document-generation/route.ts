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

export async function POST(request: Request){
    try {
        const data = await request.json();

        const templateRouteContract = path.join(process.cwd(), 'templates', 'Contrato_Adhesion_Institucional_v1.docx');
        const templateRouteRulebook = path.join(process.cwd(), 'templates', 'Template_Rulebook_v1.docx');
        const templateRouteTerms = path.join(process.cwd(), 'templates', 'Terminos_y_Condiciones_Template_v1.docx');
        const tempFolder = path.join(process.cwd(), 'temp');

        const contractContent = fs.readFileSync(templateRouteContract, 'binary');
        const rulebookContent = fs.readFileSync(templateRouteRulebook, 'binary');
        const termsContent = fs.readFileSync(templateRouteTerms, 'binary');

        const contractZip = new PizZip(contractContent);
        const rulebookZip = new PizZip(rulebookContent);
        const termsZip = new PizZip(termsContent);

        const contractDoc = new Docxtemplater(contractZip, {
            paragraphLoop: true,
            linebreaks: true,
            parser: expressionParser,
            delimiters: { start: '[[', end: ']]'},
            nullGetter: function(field) {
                return "___";
            }
        });
        const rulebookDoc = new Docxtemplater(rulebookZip, {
            paragraphLoop: true,
            linebreaks: true,
            parser: expressionParser,
            delimiters: { start: '[[', end: ']]'},
            nullGetter: function(field) {
                return "___";
            }
        });
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
            console.log(data);
            await contractDoc.renderAsync(data);
            await rulebookDoc.renderAsync(data);
            await termsDoc.renderAsync(data);
        } catch (error) {
            console.error("Error while generating the docs: ", error);
            return NextResponse.json({ error: 'Error while generating the documents'}, {status: 500});
        }

        const wordContractGenerated = contractDoc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
        const wordRulebookGenerated = rulebookDoc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
        const wordTermsGenerated = termsDoc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        const versionValue = data.version;
        const nameContractWord = 'Contrato_Adhesion_Institucional_' + versionValue + '.docx';
        const nameRulebookWord = 'Rulebook_' + versionValue + '.docx';
        const nameTermsWord = 'Terminos_y_Condiciones_' + versionValue + '.docx';

        const storageRouteContract = path.join(tempFolder, nameContractWord);
        const storageRouteRulebook = path.join(tempFolder, nameRulebookWord);
        const storageRouteTerms = path.join(tempFolder, nameTermsWord);

        fs.writeFileSync(storageRouteContract, wordContractGenerated);
        fs.writeFileSync(storageRouteRulebook, wordRulebookGenerated);
        fs.writeFileSync(storageRouteTerms, wordTermsGenerated);
        return NextResponse.json({status: 200})
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 50 });
    }
}