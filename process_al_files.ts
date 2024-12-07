import { walk } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

async function processALFiles(inputDir: string, outputDir: string, apiKey: string) {
  try {
    await Deno.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  for await (const entry of walk(inputDir, { 
    exts: ['.al'],
    followSymlinks: false 
  })) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2532,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `<examples>\n<example>\n<code>\nnamespace STM.BusinessCentral.Sentinel;\n\nusing Microsoft.Foundation.NoSeries;\nusing Microsoft.Purchases.Setup;\nusing Microsoft.Sales.Setup;\nusing STM.BusinessCentral.Sentinel;\n\ncodeunit 71180281 NonPostNoSeriesGapsSESTM implements IAuditAlertSESTM\n{\n    Access = Internal;\n    Permissions =\n        tabledata AlertSESTM = RI,\n        tabledata \"No. Series\" = R,\n        tabledata \"No. Series Line\" = R,\n        tabledata \"Purchases & Payables Setup\" = R,\n        tabledata \"Sales & Receivables Setup\" = R;\n\n    procedure CreateAlerts()\n    begin\n        CheckSalesSetup();\n        CheckPurchaseSetup();\n    end;\n\n    local procedure CheckPurchaseSetup()\n    var\n        PurchaseSetup: Record \"Purchases & Payables Setup\";\n    begin\n        PurchaseSetup.ReadIsolation(IsolationLevel::ReadUncommitted);\n        PurchaseSetup.SetLoadFields(\"Order Nos.\", \"Invoice Nos.\", \"Credit Memo Nos.\", \"Quote Nos.\", \"Vendor Nos.\", \"Blanket Order Nos.\", \"Price List Nos.\", \"Return Order Nos.\");\n        if not PurchaseSetup.Get() then\n            exit;\n\n        CheckNoSeries(PurchaseSetup.\"Order Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Invoice Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Credit Memo Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Quote Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Vendor Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Blanket Order Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Price List Nos.\");\n        CheckNoSeries(PurchaseSetup.\"Return Order Nos.\");\n    end;\n\n    local procedure CheckSalesSetup()\n    var\n        SalesSetup: Record \"Sales & Receivables Setup\";\n    begin\n        SalesSetup.ReadIsolation(IsolationLevel::ReadUncommitted);\n        SalesSetup.SetLoadFields(\"Order Nos.\", \"Invoice Nos.\", \"Credit Memo Nos.\", \"Quote Nos.\", \"Customer Nos.\", \"Blanket Order Nos.\", \"Reminder Nos.\", \"Fin. Chrg. Memo Nos.\", \"Direct Debit Mandate Nos.\", \"Price List Nos.\");\n        if not SalesSetup.Get() then\n            exit;\n\n        CheckNoSeries(SalesSetup.\"Order Nos.\");\n        CheckNoSeries(SalesSetup.\"Invoice Nos.\");\n        CheckNoSeries(SalesSetup.\"Credit Memo Nos.\");\n        CheckNoSeries(SalesSetup.\"Quote Nos.\");\n        CheckNoSeries(SalesSetup.\"Customer Nos.\");\n        CheckNoSeries(SalesSetup.\"Blanket Order Nos.\");\n        CheckNoSeries(SalesSetup.\"Reminder Nos.\");\n        CheckNoSeries(SalesSetup.\"Fin. Chrg. Memo Nos.\");\n        CheckNoSeries(SalesSetup.\"Direct Debit Mandate Nos.\");\n        CheckNoSeries(SalesSetup.\"Price List Nos.\");\n    end;\n\n    local procedure CheckNoSeries(NoSeriesCode: Code[20])\n    var\n        Alert: Record AlertSESTM;\n        NoSeriesLine: Record \"No. Series Line\";\n        NoSeriesSingle: Interface \"No. Series - Single\";\n        ActionRecommendationLbl: Label 'Change No Series %1 to allow gaps', Comment = '%1 = No. Series Code';\n        LongDescLbl: Label 'The No. Series %1 does not allow gaps and is responsible for non-posting documents/records. Consider configuring the No. Series to allow gaps to increase performance and decrease locking.', Comment = '%1 = No. Series Code';\n        ShortDescLbl: Label 'No Series %1 does not allow gaps', Comment = '%1 = No. Series Code';\n    begin\n        NoSeriesLine.SetRange(\"Series Code\", NoSeriesCode);\n        if NoSeriesLine.FindSet() then\n            repeat\n                NoSeriesSingle := NoSeriesLine.Implementation;\n                if not NoSeriesSingle.MayProduceGaps() then\n                    Alert.New(\n                        AlertCodeSESTM::\"SE-000006\",\n                        StrSubstNo(ShortDescLbl, NoSeriesCode),\n                        SeveritySESTM::Warning,\n                        AreaSESTM::Performance,\n                        StrSubstNo(LongDescLbl, NoSeriesCode),\n                        StrSubstNo(ActionRecommendationLbl, NoSeriesCode),\n                        NoSeriesCode\n                    );\n            until NoSeriesLine.Next() = 0;\n    end;\n\n    procedure ShowMoreDetails(var Alert: Record AlertSESTM)\n    var\n        WikiLinkTok: Label 'https://github.com/StefanMaron/BusinessCentral.Sentinel/wiki/SE-000006', Locked = true;\n    begin\n        Hyperlink(WikiLinkTok);\n    end;\n\n    procedure ShowRelatedInformation(var Alert: Record AlertSESTM)\n    var\n        NoSeries: Record \"No. Series\";\n        OpenRecordQst: Label 'Do you want to open the No. Series %1?', Comment = '%1 = No. Series Code';\n    begin\n        if not Confirm(StrSubstNo(OpenRecordQst, Alert.UniqueIdentifier)) then\n            exit;\n\n        NoSeries.SetRange(\"Code\", Alert.UniqueIdentifier);\n        Page.Run(Page::\"No. Series\", NoSeries);\n    end;\n\n    procedure AutoFix(var Alert: Record AlertSESTM)\n    begin\n\n    end;\n}\n</code>\n<ideal_output>\n<code_analysis>\na. Rule ID: SE-000006\nb. Purpose: This rule checks for number series configurations in Business Central that don't allow gaps in both Sales and Purchase setups.\nc. What the rule checks:\n   - Purchase-related number series for: Orders, Invoices, Credit Memos, Quotes, Vendor Numbers, Blanket Orders, Price Lists, Return Orders\n   - Sales-related number series for: Orders, Invoices, Credit Memos, Quotes, Customer Numbers, Blanket Orders, Reminders, Finance Charge Memos, Direct Debit Mandates, Price Lists\nd. Why the rule matters: Number series that don't allow gaps can cause performance issues and locking problems in Business Central.\ne. Recommendation: Change the identified number series to allow gaps to improve performance and reduce locking issues.\nf. Severity: Warning\n   Area: Performance\n</code_analysis>\n\n**Rule ID: SE-000006**  \n**Purpose**: This rule checks for number series configurations in Business Central that don't allow gaps in both Sales and Purchase setups.\n \n**What it checks**:\n1. **Purchase-related number series** for:\n   - Orders\n   - Invoices\n   - Credit Memos\n   - Quotes\n   - Vendor Numbers\n   - Blanket Orders\n   - Price Lists\n   - Return Orders\n \n2. **Sales-related number series** for:\n   - Orders\n   - Invoices\n   - Credit Memos\n   - Quotes\n   - Customer Numbers\n   - Blanket Orders\n   - Reminders\n   - Finance Charge Memos\n   - Direct Debit Mandates\n   - Price Lists\n \n**Why it matters**: Number series that don't allow gaps can cause performance issues and locking problems in Business Central. The rule generates a warning alert when it finds such configurations.\n \n**Recommendation**: When identified, it suggests changing the number series to allow gaps to improve performance and reduce locking issues.\n \n**Severity**: Warning\n**Area**: Performance\n</ideal_output>\n</example>\n</examples>\n\nYou are an expert in analyzing Business Central AL code and creating documentation for a security product called Sentinel. Your task is to review the provided AL code and generate a concise summary of the rule it implements.\n\nHere's the AL code you need to analyze:\n\n<code>\n${content}</code>\n\nPlease follow these steps to create your summary:\n\n1. Carefully analyze the provided AL code.\n2. Identify the key components of the rule, including its ID, purpose, what it checks, why it matters, and any recommendations.\n3. Wrap your analysis inside <code_analysis> tags, following these steps:\n   a. Identify the rule ID\n   b. Determine the rule's purpose\n   c. List what the rule checks\n   d. Explain why the rule matters\n   e. Formulate a recommendation\n   f. Determine severity and area\n4. Based on your analysis, create a structured summary following the exact format provided below.\n\nYour final output must adhere to this structure:\n\n\`\`\`\n**Rule ID: [ID]**\n**Purpose**: [Brief description of what the rule does]\n\n**What it checks**:\n[List of items or configurations the rule examines]\n\n**Why it matters**: [Explanation of the rule's importance and potential consequences]\n\n**Recommendation**: [Suggested action or best practice]\n\n**Severity**: [Severity level]\n**Area**: [Relevant area in Business Central]\n\`\`\`\n\nRemember to fill in the placeholders with the appropriate information derived from your code analysis. Ensure that your summary is concise, accurate, and follows this structure exactly.\n\nBegin your response with your analysis, then provide the formatted summary.`
                }
              ]
            },
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "<code_analysis>"
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      const outputFilename = entry.name.replace('.al', '.md');
      const outputPath = join(outputDir, outputFilename);
      
      // Extract only the content after </code_analysis>
      const text = result.content[0].text;
      const markdownContent = text.split('</code_analysis>')[1]?.trim() ?? text;
      await Deno.writeTextFile(outputPath, markdownContent);
      
      console.log(`Processed ${entry.name} -> ${outputFilename}`);
    }
  }
}

// Get command line arguments
const args = Deno.args;
if (args.length !== 2) {
  console.error("Usage: deno run --allow-read --allow-write --allow-net --allow-env process_al_files.ts <input_dir> <output_dir>");
  Deno.exit(1);
}

const [inputDir, outputDir] = args;
const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

if (!apiKey) {
  console.error("Please set ANTHROPIC_API_KEY environment variable");
  Deno.exit(1);
}

// Verify input directory exists
try {
  const inputDirInfo = await Deno.stat(inputDir);
  if (!inputDirInfo.isDirectory) {
    console.error(`Error: ${inputDir} is not a directory`);
    Deno.exit(1);
  }
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error(`Error: Input directory ${inputDir} does not exist`);
    Deno.exit(1);
  }
  throw error;
}

processALFiles(inputDir, outputDir, apiKey).catch(console.error);
