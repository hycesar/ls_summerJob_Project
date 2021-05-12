# Script responsible for revising xml file and finding possible errors in blocks.
import xml.etree.ElementTree as ET
import json
import sys

# Function responsible for traversing the xml file from the tree, capturing the outermost blocks.
def getBlocksSubSystem(root):
    for node in root:
        if (root.tag == "Block"):
            if (root.attrib.get("BlockType") == "SubSystem" and len(root.attrib) > 1):
                if (root not in blocksSubSystem):
                    blocksSubSystem.append(root) #apend this block to blocksubsystem
        else:
            getBlocksSubSystem(node) #continue until find somenode

# Function responsible for capturing all the simplest block types in the file.
def getBlocks(blocksSubSystem):
    for bigBlock in blocksSubSystem:
        loopAux(bigBlock) #break in small blocks

# Function responsible for capturing model default blocks.
def getBlocksDefaults(root):
    for node in root:
        if (root.tag == "Block" and len(root.attrib) == 1): # In the XML: <Block BlockType="TypeOfTheBlock">
            block = ("Default", root)
            if (block not in blocksDefault):
                blocksDefault.append(block) #add to the list of blocks
        else:
            getBlocksDefaults(node) #continue do go depper

# Loop that checks which type of block. 
# If it is one of type SubSystem, it creates a recursion. 
# Otherwise, it calls a function to check which block type (default or user created).
def loopAux(bigBlock):
    for block in bigBlock:
        if (block.tag == "System"):
            for miniBlock in block:
                if (miniBlock.tag == "Block"):
                    if (miniBlock.attrib.get("BlockType") == "SubSystem"):
                        loopAux(miniBlock) #continue breaking in small blocks
                    else:
                        checkBlockType(bigBlock, miniBlock) #check if is defauld or user created block

# Auxiliary function to check block type (default or user created).
def checkBlockType(bigBlock, miniBlock):
    address = ((bigBlock.attrib.get("Name")), miniBlock) # Tuple containing location and block
    if (len(miniBlock.attrib) == 1): # In the XML: <Block BlockType="TypeOfTheBlock">
        if (miniBlock not in blocksDefault): #default block 
            blocksDefault.append(address) #an different block?
    elif (miniBlock not in blocks):
        blocks.append(address) #user defined block

# Function that creates a branch: 
# If the information is not found in the user-created block, 
# it checks if this information is contained in the default
# block of that type and also if the information is correct.
def checkBlock(blockDefault, block, blockGuide, blockType):
    flag = True
    for infoGuide in blockGuide:
        loopCheckBlock(block, infoGuide, blockType, flag) 
        if (flag == True):
            loopCheckBlock(blockDefault, infoGuide, blockType, flag)

# Function responsible for checking block information and adding error messages.
def loopCheckBlock(block, infoGuide, blockType, flag):
    for info in block[1]:
        if (info.attrib.get("Name") == infoGuide):
            if (guides[blockType][infoGuide] != "needed"):
                if (guides[blockType][infoGuide] != info.text):
                    message = "Error encountered in block => " + block[1].attrib.get("Name") + "<br>Block type: " + block[1].attrib.get("BlockType") + "<br>Location: " + block[0] + "<br>Error type: " + infoGuide
                    if (message not in errors):
                        errors.append(message)
                        flag = False

# Function responsible for taking the style guide corresponding to 
# the block type and then calling an auxiliary function to check the parameters of the blocks.
def getGuide(blocks, blocksDefault):
    for block in blocks:
        blockType = block[1].attrib.get("BlockType")
        blockDefault = block[1]
        findBlock(blockType, blocksDefault, blockDefault) #find an defaul block and return in blockDefault
        if (blockType in guides):
            blockGuide = guides[blockType] #
            checkBlock(blockDefault, block, blockGuide, blockType)
        else:
            if (blockType != None):
                message = "Style guide undefined for => " + blockType + " block."
                if (message not in undefinedGuide):
                   undefinedGuide.append(message)

# Function that looks for the default block corresponding to the specified block.
def findBlock(blockType, blocks, result):
    for block in blocks:
        if (block[1].attrib.get("BlockType") == blockType):
            result = block

# File containing style guides for each block.
fileJson = open("./scripts/mdl-slx/guides.json", 'r')
guides = json.load(fileJson)

# Xml file address.
fileName = sys.argv[1]
tree = ET.parse(fileName)
root = tree.getroot()

# Auxiliary Lists
blocksSubSystem = []
blocks = []
blocksDefault = []
errors = []
undefinedGuide = []

# Function calls.
getBlocksSubSystem(root)
getBlocksDefaults(root)
getBlocks(blocksSubSystem)
getGuide(blocks, blocksDefault)

# Report file creation.
name = fileName.split(".")
reportFile = name[0] + ".txt"
output = open(reportFile, "w")

# Inserting error list into .txt file.
errors = errors + undefinedGuide
for i in range(len(errors)):
    output.write(errors[i]) # Adding errors to the file.
    if not(i == len(errors) - 1):        
        output.write("####") # Kind of breakline.

output.close()